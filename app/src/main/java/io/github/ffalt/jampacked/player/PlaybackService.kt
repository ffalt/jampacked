package io.github.ffalt.jampacked.player

import android.app.PendingIntent
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.core.net.toUri
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.common.Timeline
import androidx.media3.common.util.UnstableApi
import androidx.media3.datasource.DataSourceBitmapLoader
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory
import androidx.media3.session.CommandButton
import androidx.media3.session.LibraryResult
import androidx.media3.session.MediaLibraryService
import androidx.media3.session.MediaSession
import androidx.media3.session.SessionCommand
import androidx.media3.session.SessionError
import androidx.media3.session.SessionResult
import com.google.common.collect.ImmutableList
import com.google.common.util.concurrent.Futures
import com.google.common.util.concurrent.ListenableFuture
import com.google.common.util.concurrent.SettableFuture
import dagger.hilt.android.AndroidEntryPoint
import io.github.ffalt.jampacked.MainActivity
import io.github.ffalt.jampacked.data.EpisodeProgressRepository
import io.github.ffalt.jampacked.data.NowPlayingRepository
import io.github.ffalt.jampacked.data.QueueRepository
import io.github.ffalt.jampacked.data.state.ObjectStateRepository
import io.github.ffalt.jampacked.ui.nav.DeepLinks
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import javax.inject.Inject

@UnstableApi
@AndroidEntryPoint
class PlaybackService : MediaLibraryService() {
    @Inject
    lateinit var downloads: Downloads

    @Inject
    lateinit var nowPlaying: NowPlayingRepository

    @Inject
    lateinit var queue: QueueRepository

    @Inject
    lateinit var episodeProgress: EpisodeProgressRepository

    @Inject
    lateinit var tree: LibraryTree

    @Inject
    lateinit var objectState: ObjectStateRepository

    private var session: MediaLibrarySession? = null
    private var favedTrackId: String? = null
    private var faved = false
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private val handler = Handler(Looper.getMainLooper())

    private lateinit var scrobbler: Scrobbler
    private var ticksSinceEpisodeSave = 0
    private val scrobbleTick =
        object : Runnable {
            override fun run() {
                val player = session?.player
                if (player != null) {
                    scrobbler.tick(
                        isPlaying = player.isPlaying,
                        currentIndex = player.currentMediaItemIndex,
                        durationMs = player.duration.takeIf { it != C.TIME_UNSET } ?: 0L
                    )
                    if (player.isPlaying && ++ticksSinceEpisodeSave >= EPISODE_SAVE_TICKS) {
                        ticksSinceEpisodeSave = 0
                        saveEpisodePosition()
                    }
                }
                handler.postDelayed(this, Scrobbler.TICK_MS)
            }
        }

    override fun onCreate() {
        super.onCreate()

        val player =
            ExoPlayer
                .Builder(this)
                .setMediaSourceFactory(DefaultMediaSourceFactory(downloads.playbackDataSourceFactory()))
                .setAudioAttributes(
                    AudioAttributes
                        .Builder()
                        .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
                        .setUsage(C.USAGE_MEDIA)
                        .build(),
                    true
                ).setHandleAudioBecomingNoisy(true)
                .build()

        scrobbler =
            Scrobbler { index ->
                val id =
                    runCatching { player.getMediaItemAt(index).mediaId }.getOrNull() ?: return@Scrobbler
                scope.launch { nowPlaying.scrobble(id) }
            }

        player.addListener(
            object : Player.Listener {
                override fun onMediaItemTransition(
                    item: MediaItem?,
                    reason: Int
                ) {
                    saveQueue()
                    refreshFavourite(item?.mediaId)
                }

                // Reorder, add and remove all land here - the queue has to outlive the process.
                override fun onTimelineChanged(
                    timeline: Timeline,
                    reason: Int
                ) {
                    saveQueue()
                }

                override fun onPlaybackStateChanged(state: Int) {
                    if (state == Player.STATE_ENDED) {
                        saveQueue()
                        saveEpisodePosition()
                    }
                }

                override fun onIsPlayingChanged(isPlaying: Boolean) {
                    if (!isPlaying) {
                        saveQueue()
                        saveEpisodePosition()
                    }
                }
            }
        )

        val openApp =
            PendingIntent.getActivity(
                this,
                0,
                Intent(Intent.ACTION_VIEW, DeepLinks.PLAYER.toUri(), this, MainActivity::class.java)
                    .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            )
        session =
            MediaLibrarySession
                .Builder(this, player, LibraryCallback())
                .setSessionActivity(openApp)
                .setBitmapLoader(
                    DataSourceBitmapLoader
                        .Builder(this)
                        .setDataSourceFactory(downloads.artworkDataSourceFactory())
                        .build()
                ).build()
        handler.postDelayed(scrobbleTick, Scrobbler.TICK_MS)
    }

    private fun saveQueue() {
        val player = session?.player ?: return
        scope.launch { queue.save(player) }
    }

    private fun saveEpisodePosition() {
        val player = session?.player ?: return
        val item = player.currentMediaItem ?: return
        if (item.toTrackEntry().podcastID == null) return
        val position = player.currentPosition.coerceAtLeast(0)
        val duration = player.duration.takeIf { it != C.TIME_UNSET } ?: 0L
        scope.launch { episodeProgress.remember(item.mediaId, position, duration) }
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaLibrarySession? = session

    private fun refreshFavourite(trackId: String?) {
        favedTrackId = trackId
        faved = false
        publishFavouriteButton()
        if (trackId == null) return
        scope.launch {
            val result = objectState.isFaved(trackId).getOrNull() ?: return@launch
            if (favedTrackId == trackId) {
                faved = result
                publishFavouriteButton()
            }
        }
    }

    private fun toggleFavourite() {
        val id = favedTrackId ?: return
        val target = !faved
        scope.launch {
            val result = objectState.setFaved(id, target).getOrNull() ?: return@launch
            if (favedTrackId == id) {
                faved = result
                publishFavouriteButton()
            }
        }
    }

    private fun publishFavouriteButton() {
        val button =
            CommandButton
                .Builder(
                    if (faved) CommandButton.ICON_HEART_FILLED else CommandButton.ICON_HEART_UNFILLED
                ).setDisplayName(if (faved) "Remove from favourites" else "Add to favourites")
                .setSessionCommand(FAVOURITE_COMMAND)
                .setEnabled(favedTrackId != null)
                .setSlots(CommandButton.SLOT_OVERFLOW)
                .build()
        session?.setMediaButtonPreferences(ImmutableList.of(button))
    }

    private inner class LibraryCallback : MediaLibrarySession.Callback {
        override fun onConnect(
            session: MediaSession,
            controller: MediaSession.ControllerInfo
        ): MediaSession.ConnectionResult {
            val commands =
                MediaSession.ConnectionResult.DEFAULT_SESSION_AND_LIBRARY_COMMANDS
                    .buildUpon()
                    .add(FAVOURITE_COMMAND)
                    .build()
            return MediaSession.ConnectionResult
                .AcceptedResultBuilder(session, controller)
                .setAvailableSessionCommands(commands)
                .build()
        }

        override fun onPostConnect(
            session: MediaSession,
            controller: MediaSession.ControllerInfo
        ) {
            publishFavouriteButton()
        }

        override fun onCustomCommand(
            session: MediaSession,
            controller: MediaSession.ControllerInfo,
            customCommand: SessionCommand,
            args: Bundle
        ): ListenableFuture<SessionResult> {
            if (customCommand.customAction == FAVOURITE_ACTION) toggleFavourite()
            return Futures.immediateFuture(SessionResult(SessionResult.RESULT_SUCCESS))
        }

        override fun onGetLibraryRoot(
            session: MediaLibrarySession,
            browser: MediaSession.ControllerInfo,
            params: LibraryParams?
        ): ListenableFuture<LibraryResult<MediaItem>> =
            if (tree.isLoggedIn) {
                Futures.immediateFuture(LibraryResult.ofItem(tree.root(), params))
            } else {
                Futures.immediateFuture(LibraryResult.ofError(SessionError.ERROR_SESSION_AUTHENTICATION_EXPIRED))
            }

        override fun onGetChildren(
            session: MediaLibrarySession,
            browser: MediaSession.ControllerInfo,
            parentId: String,
            page: Int,
            pageSize: Int,
            params: LibraryParams?
        ): ListenableFuture<LibraryResult<ImmutableList<MediaItem>>> =
            future {
                tree
                    .children(parentId, page, pageSize)
                    ?.let { LibraryResult.ofItemList(it, params) }
                    ?: LibraryResult.ofError(SessionError.ERROR_BAD_VALUE)
            }

        override fun onGetItem(
            session: MediaLibrarySession,
            browser: MediaSession.ControllerInfo,
            mediaId: String
        ): ListenableFuture<LibraryResult<MediaItem>> =
            future {
                tree.item(mediaId)?.let { LibraryResult.ofItem(it, null) }
                    ?: LibraryResult.ofError(SessionError.ERROR_BAD_VALUE)
            }

        // Browsers send bare ids; the app itself already sends items with a stream uri.
        override fun onAddMediaItems(
            mediaSession: MediaSession,
            controller: MediaSession.ControllerInfo,
            mediaItems: MutableList<MediaItem>
        ): ListenableFuture<MutableList<MediaItem>> =
            future {
                mediaItems
                    .flatMap { item ->
                        if (item.localConfiguration != null) listOf(item) else tree.resolve(item.mediaId)
                    }.toMutableList()
            }
    }

    private fun <T : Any> future(block: suspend () -> T): ListenableFuture<T> {
        val result = SettableFuture.create<T>()
        scope.launch {
            try {
                result.set(block())
            } catch (e: Exception) {
                result.setException(e)
            }
        }
        return result
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        val player = session?.player
        if (player == null || !player.playWhenReady || player.mediaItemCount == 0) {
            stopSelf()
        }
    }

    private companion object {
        private const val EPISODE_SAVE_TICKS = 10
        const val FAVOURITE_ACTION = "io.github.ffalt.jampacked.FAVOURITE"
        val FAVOURITE_COMMAND = SessionCommand(FAVOURITE_ACTION, Bundle.EMPTY)
    }

    override fun onDestroy() {
        handler.removeCallbacks(scrobbleTick)
        scope.cancel()
        session?.run {
            player.release()
            release()
        }
        session = null
        super.onDestroy()
    }
}
