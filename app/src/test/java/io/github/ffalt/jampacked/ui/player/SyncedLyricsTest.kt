package io.github.ffalt.jampacked.ui.player

import io.github.ffalt.jampacked.data.repo.LyricsLine
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class SyncedLyricsTest {
    @Test
    fun `finds the latest line active at the playback position`() {
        val lines =
            listOf(
                LyricsLine(1_000, "First"),
                LyricsLine(2_500, "Second")
            )

        assertNull(activeLyricIndex(lines, 999))
        assertEquals(0, activeLyricIndex(lines, 1_000))
        assertEquals(0, activeLyricIndex(lines, 2_499))
        assertEquals(1, activeLyricIndex(lines, 2_500))
    }
}
