package io.github.ffalt.jampacked.data

import org.junit.Assert.assertEquals
import org.junit.Test

class EpisodeProgressTest {
    private val hourLong = 3_600_000L

    @Test
    fun `a position in the middle of an episode is worth resuming`() {
        assertEquals(true, positionWorthResuming(1_800_000, hourLong))
    }

    @Test
    fun `the first seconds are not worth resuming`() {
        assertEquals(false, positionWorthResuming(0, hourLong))
        assertEquals(false, positionWorthResuming(9_999, hourLong))
        assertEquals(true, positionWorthResuming(10_000, hourLong))
    }

    @Test
    fun `an episode played to its end starts over instead of resuming`() {
        assertEquals(false, positionWorthResuming(hourLong, hourLong))
        assertEquals(false, positionWorthResuming(hourLong - 30_000, hourLong))
        assertEquals(true, positionWorthResuming(hourLong - 30_001, hourLong))
    }

    @Test
    fun `an unknown duration still resumes, since nothing says it finished`() {
        assertEquals(true, positionWorthResuming(1_800_000, 0))
    }
}
