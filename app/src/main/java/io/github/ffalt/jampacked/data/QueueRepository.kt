package io.github.ffalt.jampacked.data

import androidx.media3.common.Player
import io.github.ffalt.jampacked.player.toMediaItem
import io.github.ffalt.jampacked.player.toTrackEntry
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class StoredQueue(
    val tracks: List<TrackEntry>,
    val currentIndex: Int,
    val position: Long
)

@Singleton
class QueueRepository
    @Inject
    constructor(
        private val settings: SettingsRepository,
        private val json: Json
    ) {
        suspend fun save(player: Player) {
            val snapshot =
                withContext(Dispatchers.Main.immediate) {
                    if (player.mediaItemCount == 0) return@withContext null
                    val tracks =
                        (0 until player.mediaItemCount).map {
                            player.getMediaItemAt(it).toTrackEntry()
                        }
                    StoredQueue(
                        tracks = tracks,
                        currentIndex = player.currentMediaItemIndex.coerceAtLeast(0),
                        position = player.currentPosition.coerceAtLeast(0)
                    )
                }
            if (snapshot == null) {
                settings.setSetting(KEY, null)
                return
            }
            runCatching { settings.setSetting(KEY, json.encodeToString(snapshot)) }
        }

        suspend fun load(): StoredQueue? {
            val raw = settings.getSetting(KEY) ?: return null
            return runCatching { json.decodeFromString<StoredQueue>(raw) }
                .getOrNull()
                ?.takeIf { it.tracks.isNotEmpty() }
        }

        suspend fun clear() = settings.setSetting(KEY, null)

        suspend fun restore(
            player: Player,
            session: JamSession
        ) {
            val stored = load() ?: return
            val index = stored.currentIndex.takeIf { it in stored.tracks.indices } ?: 0
            withContext(Dispatchers.Main.immediate) {
                player.setMediaItems(
                    stored.tracks.map { it.toMediaItem(session) },
                    index,
                    stored.position
                )
                player.prepare()
            }
        }

        private companion object {
            const val KEY = "player-queue"
        }
    }
