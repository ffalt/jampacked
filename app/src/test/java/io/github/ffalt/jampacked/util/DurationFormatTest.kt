package io.github.ffalt.jampacked.util

import org.junit.Assert.assertEquals
import org.junit.Test

class DurationFormatTest {
    @Test
    fun `null renders as empty, matching the undefined case`() {
        assertEquals("", formatDuration(null))
    }

    @Test
    fun `zero renders as a padded minute and second`() {
        assertEquals("00:00", formatDuration(0))
    }

    @Test
    fun `seconds only`() {
        assertEquals("00:07", formatDuration(7_000))
        assertEquals("00:59", formatDuration(59_000))
    }

    @Test
    fun `minutes and seconds`() {
        assertEquals("01:05", formatDuration(65_000))
        assertEquals("05:48", formatDuration(348_000))
        assertEquals("59:59", formatDuration(3_599_000))
    }

    @Test
    fun `hours drop the leading zero when there are no days`() {
        assertEquals("1:00:00", formatDuration(3_600_000))
        assertEquals("1:02:05", formatDuration(3_725_000))
    }

    @Test
    fun `days pad the hours`() {
        assertEquals("1d 01:01:01", formatDuration(90_061_000))
    }

    @Test
    fun `sub-second values round like the javascript original`() {
        assertEquals("00:01", formatDuration(500))
        assertEquals("00:00", formatDuration(499))
    }

    @Test
    fun `human file size`() {
        assertEquals("512 B", humanFileSize(512))
        assertEquals("1.0 KiB", humanFileSize(1024))
        assertEquals("1.5 KiB", humanFileSize(1536))
        assertEquals("1.0 MiB", humanFileSize(1024L * 1024))
        assertEquals("2.5 GiB", humanFileSize((2.5 * 1024 * 1024 * 1024).toLong()))
    }
}
