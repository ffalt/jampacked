package io.github.ffalt.jampacked.data

import org.junit.Assert.assertEquals
import org.junit.Test

class StreamUrlTest {
    private val session =
        JamSession(
            server = "https://music.example",
            token = "t",
            userId = "u1",
            userName = "u"
        )

    private val streamBase = "https://music.example/jam/v1/stream/track1"

    private val playableOnThisDevice = setOf("mp3", "flac", "m4a", "ogg", "wav")

    private fun url(
        options: StreamOptions,
        mediaFormat: String? = null
    ) = session.streamUrl("track1", options.requestFor(mediaFormat, playableOnThisDevice))

    @Test
    fun `default options request the mp3 url earlier builds requested`() {
        assertEquals("$streamBase.mp3", session.streamUrl("track1"))
    }

    @Test
    fun `mp3 is the default format`() {
        assertEquals(StreamFormat.MP3, StreamOptions().format)
        assertEquals("$streamBase.mp3", url(StreamOptions(), mediaFormat = "flac"))
    }

    @Test
    fun `mp3 transcodes whatever the source format is`() {
        val options = StreamOptions(format = StreamFormat.MP3)
        assertEquals("$streamBase.mp3", url(options, mediaFormat = "flac"))
    }

    @Test
    fun `original requests the format the track already is so the server skips transcoding`() {
        val options = StreamOptions(format = StreamFormat.ORIGINAL)
        assertEquals("$streamBase.flac", url(options, mediaFormat = "flac"))
        assertEquals("$streamBase.m4a", url(options, mediaFormat = "m4a"))
    }

    @Test
    fun `original falls back to mp3 for a format this device cannot decode`() {
        val options = StreamOptions(format = StreamFormat.ORIGINAL)
        assertEquals("$streamBase.mp3", url(options, mediaFormat = "webma"))
        assertEquals("$streamBase.mp3", url(options, mediaFormat = "UNKNOWN__"))
    }

    @Test
    fun `original falls back to mp3 for a track cached before mediaFormat was requested`() {
        val options = StreamOptions(format = StreamFormat.ORIGINAL)
        assertEquals("$streamBase.mp3", url(options, mediaFormat = null))
    }

    @Test
    fun `the cap is an underscore path suffix and never a query parameter`() {
        val options = StreamOptions(format = StreamFormat.MP3, cap = BitrateCap.KBPS_192)
        assertEquals("${streamBase}_192.mp3", url(options))
    }

    @Test
    fun `an uncapped request carries no suffix`() {
        val options = StreamOptions(format = StreamFormat.MP3, cap = BitrateCap.OFF)
        assertEquals("$streamBase.mp3", url(options))
    }

    @Test
    fun `the cap applies to the original format too`() {
        val options = StreamOptions(format = StreamFormat.ORIGINAL, cap = BitrateCap.KBPS_256)
        assertEquals("${streamBase}_256.flac", url(options, mediaFormat = "flac"))
    }

    @Test
    fun `every cap stays within the servers accepted range of 10 to 320`() {
        BitrateCap.entries.mapNotNull { it.kbps }.forEach { kbps ->
            assertEquals(true, kbps in 10..320)
        }
    }

    @Test
    fun `the cache key never follows the settings so pinned downloads stay found`() {
        assertEquals("$streamBase.mp3", session.cacheKey("track1"))
        assertEquals(session.streamUrl("track1"), session.cacheKey("track1"))
    }
}
