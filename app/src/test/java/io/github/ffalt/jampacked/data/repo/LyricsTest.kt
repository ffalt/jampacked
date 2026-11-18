package io.github.ffalt.jampacked.data.repo

import org.junit.Assert.assertEquals
import org.junit.Test

class LyricsTest {
    @Test
    fun `prefers synchronized lyrics when available`() {
        val synced = "[00:01.00]First line\n[00:02.00]Second line"

        assertEquals(Lyrics(synced, "tag"), lyricsText("Plain lyrics", synced, "tag"))
    }

    @Test
    fun `falls back to plain lyrics when synchronized lyrics are missing or blank`() {
        assertEquals(Lyrics("Plain lyrics", "tag"), lyricsText("Plain lyrics", null, "tag"))
        assertEquals(Lyrics("Plain lyrics", "tag"), lyricsText("Plain lyrics", "  ", "tag"))
    }

    @Test
    fun `returns no lyrics when neither version is available`() {
        assertEquals(null, lyricsText(null, null, null))
    }
}
