package io.github.ffalt.jampacked.player

import android.content.ComponentName
import android.content.Context
import androidx.annotation.OptIn
import androidx.media3.common.C
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import com.google.common.util.concurrent.MoreExecutors
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.data.EpisodeProgressRepository
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.QueueRepository
import io.github.ffalt.jampacked.data.StreamSettingsRepository
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.auth.AuthRepository
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.time.Duration.Companion.milliseconds

data class PlayerState(
    val connected: Boolean = false,
    val isPlaying: Boolean = false,
    val currentIndex: Int = -1,
    val current: TrackEntry? = null,
    val positionMs: Long = 0,
    val durationMs: Long = 0,
    val queue: List<TrackEntry> = emptyList(),
    val shuffle: Boolean = false,
    val repeat: RepeatMode = RepeatMode.OFF
)

enum class RepeatMode { OFF, ALL, ONE }

@Singleton
class PlayerRepository
    @Inject
    constructor(
        @ApplicationContext private val context: Context,
        private val auth: AuthRepository,
        private val queueRepo: QueueRepository,
        private val streamSettings: StreamSettingsRepository,
        private val episodeProgress: EpisodeProgressRepository
    ) {
        private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
        private val uiState = MutableStateFlow(PlayerState())
        val state: StateFlow<PlayerState> = uiState.asStateFlow()

        private var controller: MediaController? = null

        private val listener =
            object : Player.Listener {
                override fun onEvents(
                    player: Player,
                    events: Player.Events
                ) = publish()
            }

        private val connected = CompletableDeferred<Unit>()

        suspend fun awaitConnected() {
            connect()
            connected.await()
        }

        @OptIn(UnstableApi::class)
        fun connect() {
            if (controller != null) return
            val token = SessionToken(context, ComponentName(context, PlaybackService::class.java))
            val future = MediaController.Builder(context, token).buildAsync()
            future.addListener({
                val c = runCatching { future.get() }.getOrNull() ?: return@addListener
                controller = c
                connected.complete(Unit)
                c.addListener(listener)
                publish()
                scope.launch { restoreIfEmpty(c) }
                startTicking()
            }, MoreExecutors.directExecutor())
        }

        fun release() {
            controller?.removeListener(listener)
            controller?.release()
            controller = null
            uiState.value = PlayerState()
        }

        private suspend fun restoreIfEmpty(c: MediaController) {
            if (c.mediaItemCount > 0) return
            val session = auth.session ?: return
            queueRepo.restore(c, session)
            publish()
        }

        private var ticking = false

        private fun startTicking() {
            if (ticking) return
            ticking = true
            scope.launch {
                while (true) {
                    if (controller?.isPlaying == true) publish()
                    delay(500.milliseconds)
                }
            }
        }

        private fun publish() {
            val c = controller
            if (c == null) {
                uiState.value = PlayerState()
                return
            }
            val queue = (0 until c.mediaItemCount).map { c.getMediaItemAt(it).toTrackEntry() }
            uiState.value =
                PlayerState(
                    connected = true,
                    isPlaying = c.isPlaying,
                    currentIndex = c.currentMediaItemIndex,
                    current = queue.getOrNull(c.currentMediaItemIndex),
                    positionMs = c.currentPosition.coerceAtLeast(0),
                    durationMs = c.duration.takeIf { it != C.TIME_UNSET }?.coerceAtLeast(0) ?: 0,
                    queue = queue,
                    shuffle = c.shuffleModeEnabled,
                    repeat =
                        when (c.repeatMode) {
                            Player.REPEAT_MODE_ONE -> RepeatMode.ONE
                            Player.REPEAT_MODE_ALL -> RepeatMode.ALL
                            else -> RepeatMode.OFF
                        }
                )
        }

        private fun session(): JamSession? = auth.session

        fun play() {
            controller?.play()
        }

        fun pause() {
            controller?.pause()
        }

        fun toggle() {
            val c = controller ?: return
            if (c.isPlaying) c.pause() else c.play()
        }

        fun playTracks(tracks: List<TrackEntry>) {
            val c = controller ?: return
            val s = session() ?: return
            val items = tracks.map { it.toMediaItem(s, streamSettings.streamRequestFor(it.mediaFormat)) }
            scope.launch {
                val resumeAt = episodeProgress.resumePositionOf(tracks.firstOrNull())
                c.setMediaItems(items, 0, resumeAt)
                c.prepare()
                c.play()
            }
        }

        fun playTrack(track: TrackEntry) {
            val c = controller ?: return
            val index =
                (0 until c.mediaItemCount).firstOrNull { c.getMediaItemAt(it).mediaId == track.id }
            if (index == null) {
                playTracks(listOf(track))
                return
            }
            c.seekTo(index, 0)
            c.play()
        }

        fun addTracksToQueue(tracks: List<TrackEntry>) {
            val c = controller ?: return
            val s = session() ?: return
            c.addMediaItems(tracks.map { it.toMediaItem(s, streamSettings.streamRequestFor(it.mediaFormat)) })
            if (c.playbackState == Player.STATE_IDLE) c.prepare()
        }

        fun addTrackToQueue(track: TrackEntry) = addTracksToQueue(listOf(track))

        fun removeFromQueue(index: Int) {
            val c = controller ?: return
            if (index in 0 until c.mediaItemCount) c.removeMediaItem(index)
        }

        fun moveInQueue(
            from: Int,
            to: Int
        ) {
            val c = controller ?: return
            if (from == to) return
            if (from !in 0 until c.mediaItemCount || to !in 0 until c.mediaItemCount) return
            c.moveMediaItem(from, to)
        }

        fun clearQueue() {
            controller?.clearMediaItems()
            scope.launch { queueRepo.clear() }
        }

        fun skipToTrack(index: Int) {
            val c = controller ?: return
            if (index in 0 until c.mediaItemCount) c.seekTo(index, 0)
        }

        fun skipToNext() {
            controller?.seekToNextMediaItem()
        }

        fun skipToPrevious() {
            controller?.seekToPreviousMediaItem()
        }

        fun skipForward() {
            val c = controller ?: return
            c.seekTo((c.currentPosition + JUMP_MS).coerceAtMost(c.duration.coerceAtLeast(0)))
        }

        fun skipBackward() {
            val c = controller ?: return
            c.seekTo((c.currentPosition - JUMP_MS).coerceAtLeast(0))
        }

        fun seekTo(positionMs: Long) {
            controller?.seekTo(positionMs.coerceAtLeast(0))
        }

        fun seekPercent(percent: Float) {
            val c = controller ?: return
            val duration = c.duration.takeIf { it != C.TIME_UNSET } ?: return
            c.seekTo((duration * percent).toLong().coerceIn(0, duration))
        }

        fun setShuffle(enabled: Boolean) {
            controller?.shuffleModeEnabled = enabled
        }

        fun toggleShuffle() {
            setShuffle(controller?.shuffleModeEnabled != true)
        }

        fun cycleRepeat() {
            val c = controller ?: return
            c.repeatMode =
                when (c.repeatMode) {
                    Player.REPEAT_MODE_OFF -> Player.REPEAT_MODE_ALL
                    Player.REPEAT_MODE_ALL -> Player.REPEAT_MODE_ONE
                    else -> Player.REPEAT_MODE_OFF
                }
        }

        fun shuffleQueue() {
            val c = controller ?: return
            val count = c.mediaItemCount
            if (count < 2) return
            val current = c.currentMediaItemIndex
            val position = c.currentPosition
            val items = (0 until count).map { c.getMediaItemAt(it) }
            val rest = items.filterIndexed { index, _ -> index != current }.shuffled()
            val shuffled = listOfNotNull(items.getOrNull(current)) + rest
            c.setMediaItems(shuffled, 0, position)
            c.prepare()
        }

        fun stop() {
            val c = controller ?: return
            c.stop()
            c.clearMediaItems()
            scope.launch { queueRepo.clear() }
        }

        fun setVolume(volume: Float) {
            controller?.volume = volume.coerceIn(0f, 1f)
        }

        private companion object {
            const val JUMP_MS = 10_000L
        }
    }
