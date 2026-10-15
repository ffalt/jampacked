package io.github.ffalt.jampacked.data

import javax.inject.Inject
import javax.inject.Singleton

private const val MIN_REMEMBERED_MS = 10_000L
private const val FINISHED_WITHIN_MS = 30_000L

fun positionWorthResuming(
    positionMs: Long,
    durationMs: Long
): Boolean {
    if (positionMs < MIN_REMEMBERED_MS) return false
    val finished = durationMs > 0 && positionMs >= durationMs - FINISHED_WITHIN_MS
    return !finished
}

@Singleton
class EpisodeProgressRepository
    @Inject
    constructor(
        private val store: SettingsRepository
    ) {
        suspend fun positionOf(episodeId: String): Long = store.getSetting(key(episodeId))?.toLongOrNull() ?: 0

        suspend fun resumePositionOf(track: TrackEntry?): Long {
            if (track?.podcastID == null) return 0
            return positionOf(track.id)
        }

        suspend fun remember(
            episodeId: String,
            positionMs: Long,
            durationMs: Long
        ) {
            if (positionWorthResuming(positionMs, durationMs)) {
                store.setSetting(key(episodeId), positionMs.toString())
            } else {
                forget(episodeId)
            }
        }

        suspend fun forget(episodeId: String) = store.setSetting(key(episodeId), null)

        private fun key(episodeId: String) = "episode_position:$episodeId"
    }
