package io.github.ffalt.jampacked.data.repo

import org.junit.Assert.assertEquals
import org.junit.Test

class LyricsTest {
    @Test
    fun `prefers an entry with synchronized lines`() {
        val plain = Lyrics("Plain lyrics", emptyList(), "tag")
        val synced = Lyrics(null, listOf(LyricsLine(1_000, "First line")), "lrclib")

        assertEquals(synced, selectLyrics(listOf(plain, synced)))
    }

    @Test
    fun `falls back to the first entry with plain lyrics`() {
        val blank = Lyrics("  ", emptyList(), "tag")
        val plain = Lyrics("Plain lyrics", emptyList(), "lrclib")

        assertEquals(plain, selectLyrics(listOf(blank, plain)))
    }

    @Test
    fun `returns no lyrics when no entry has content`() {
        assertEquals(null, selectLyrics(emptyList()))
        assertEquals(null, selectLyrics(listOf(Lyrics(null, emptyList(), "tag"))))
    }
}
