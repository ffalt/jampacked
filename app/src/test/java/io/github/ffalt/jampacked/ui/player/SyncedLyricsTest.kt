package io.github.ffalt.jampacked.ui.player

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class SyncedLyricsTest {
    @Test
    fun `parses timestamps and strips them from displayed text`() {
        assertEquals(
            listOf(
                TimedLyricLine(1_230, "First line"),
                TimedLyricLine(12_450, "Second line")
            ),
            parseTimedLyrics("[00:01.23]First line\n[00:12.45]Second line")
        )
    }

    @Test
    fun `supports multiple timestamps on a lyric line`() {
        assertEquals(
            listOf(
                TimedLyricLine(1_000, "Repeated line"),
                TimedLyricLine(2_500, "Repeated line")
            ),
            parseTimedLyrics("[00:01.00][00:02.50]Repeated line")
        )
    }

    @Test
    fun `normalizes fractional seconds and sorts lyric lines`() {
        assertEquals(
            listOf(
                TimedLyricLine(60_300, "First"),
                TimedLyricLine(62_450, "Second")
            ),
            parseTimedLyrics("[01:02.45]Second\n[01:00.3]First")
        )
    }

    @Test
    fun `ignores metadata lines`() {
        assertEquals(
            listOf(TimedLyricLine(1_000, "First")),
            parseTimedLyrics("[ar:Artist]\n[00:01.00]First\n[ti:Title]")
        )
    }

    @Test
    fun `returns no timed lines for plain lyrics`() {
        assertNull(parseTimedLyrics("First line\nSecond line"))
    }

    @Test
    fun `finds the latest line active at the playback position`() {
        val lines =
            listOf(
                TimedLyricLine(1_000, "First"),
                TimedLyricLine(2_500, "Second")
            )

        assertNull(activeLyricIndex(lines, 999))
        assertEquals(0, activeLyricIndex(lines, 1_000))
        assertEquals(0, activeLyricIndex(lines, 2_499))
        assertEquals(1, activeLyricIndex(lines, 2_500))
    }
}
