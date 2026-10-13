package io.github.ffalt.jampacked.player

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ScrobblerTest {
    private val fired = mutableListOf<Int>()
    private val scrobbler = Scrobbler { fired.add(it) }

    private fun play(
        seconds: Int,
        index: Int = 0,
        durationMs: Long = 200_000
    ) {
        repeat(seconds) {
            scrobbler.tick(
                isPlaying = true,
                currentIndex = index,
                durationMs = durationMs
            )
        }
    }

    @Test
    fun `fires once past half the track duration`() {
        play(seconds = 101)
        assertTrue("should not have fired yet", fired.isEmpty())

        play(seconds = 1)
        assertEquals(listOf(0), fired)
    }

    @Test
    fun `fires only once per track`() {
        play(seconds = 300)
        assertEquals("must not scrobble repeatedly", listOf(0), fired)
    }

    @Test
    fun `paused time does not count towards the trigger`() {
        play(seconds = 50)
        repeat(500) { scrobbler.tick(isPlaying = false, currentIndex = 0, durationMs = 200_000) }
        assertTrue("pausing must not accumulate", fired.isEmpty())

        play(seconds = 52)
        assertEquals(listOf(0), fired)
    }

    @Test
    fun `a track change resets the accumulator`() {
        play(seconds = 90)
        assertTrue(fired.isEmpty())

        play(seconds = 90, index = 1)
        assertTrue("progress from the previous track must not carry over", fired.isEmpty())

        play(seconds = 12, index = 1)
        assertEquals(listOf(1), fired)
    }

    @Test
    fun `trigger is capped at four hours for very long tracks`() {
        val twelveHours = 12L * 60 * 60 * 1000
        play(seconds = 4 * 60 * 60 + 1, durationMs = twelveHours)
        assertTrue("should not have fired before the 4h cap", fired.isEmpty())

        play(seconds = 1, durationMs = twelveHours)
        assertEquals(listOf(0), fired)
    }

    @Test
    fun `an unknown duration defers the trigger until it is known`() {
        repeat(10) { scrobbler.tick(isPlaying = true, currentIndex = 0, durationMs = 0) }
        assertTrue(fired.isEmpty())
        play(seconds = 60, durationMs = 100_000)
        assertEquals(listOf(0), fired)
    }

    @Test
    fun `negative index is ignored`() {
        repeat(500) { scrobbler.tick(isPlaying = true, currentIndex = -1, durationMs = 200_000) }
        assertTrue(fired.isEmpty())
    }

    @Test
    fun `reset clears everything`() {
        play(seconds = 90)
        scrobbler.reset()
        play(seconds = 90)
        assertTrue("after a reset the count starts again", fired.isEmpty())
    }

    @Test
    fun `constants match the java original`() {
        assertEquals(1000L, Scrobbler.TICK_MS)
        assertEquals(4L * 60 * 60 * 1000, Scrobbler.MAX_TRIGGER_MS)
    }
}
