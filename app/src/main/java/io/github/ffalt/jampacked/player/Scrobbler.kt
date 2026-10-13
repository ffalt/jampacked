package io.github.ffalt.jampacked.player

class Scrobbler(
    private val onScrobble: (trackIndex: Int) -> Unit
) {
    private var trackIndex: Int = INDEX_UNSET
    private var accumulated: Long = 0
    private var trigger: Long = 0
    private var done: Boolean = false

    fun reset() {
        accumulated = 0
        trigger = 0
        trackIndex = INDEX_UNSET
        done = false
    }

    fun tick(
        isPlaying: Boolean,
        currentIndex: Int,
        durationMs: Long
    ) {
        if (!isPlaying || currentIndex < 0) return

        if (currentIndex != trackIndex) {
            reset()
            trigger = minOf(durationMs / 2, MAX_TRIGGER_MS)
            trackIndex = currentIndex
            return
        }
        if (done) return

        if (trigger <= 0 && durationMs > 0) {
            trigger = minOf(durationMs / 2, MAX_TRIGGER_MS)
        }

        accumulated += TICK_MS
        if (trigger in 1..<accumulated) {
            done = true
            onScrobble(currentIndex)
        }
    }

    companion object {
        const val TICK_MS = 1000L

        const val MAX_TRIGGER_MS = 4L * 60 * 60 * 1000

        const val INDEX_UNSET = -1
    }
}
