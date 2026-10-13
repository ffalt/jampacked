package io.github.ffalt.jampacked.data.repo

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class WaveformTest {
    private fun waveform(vararg pairs: Int) =
        WaveformJson(
            sampleRate = 44100,
            length = pairs.size / 2,
            data = pairs.toList()
        )

    @Test
    fun `empty input yields no bars`() {
        assertTrue(WaveformJson().toBars(10).isEmpty())
        assertTrue(waveform(-100, 100).toBars(0).isEmpty())
    }

    @Test
    fun `always returns exactly the requested bar count`() {
        val w = waveform(*IntArray(2000) { if (it % 2 == 0) -1000 else 1000 })
        assertEquals(50, w.toBars(50).size)
        assertEquals(1, w.toBars(1).size)

        assertEquals(5000, w.toBars(5000).size)
    }

    @Test
    fun `values are normalised against half the sample rate`() {
        val w = waveform(-22050, 22050)
        val bar = w.toBars(1).single()
        assertEquals(-1f, bar.min, 0.001f)
        assertEquals(1f, bar.max, 0.001f)
    }

    @Test
    fun `the bit depth does not change the scale`() {
        val w = WaveformJson(sampleRate = 44100, bits = 8, length = 1, data = listOf(-128, 127))
        val bar = w.toBars(1).single()
        assertEquals(-128f / 22050f, bar.min, 0.0001f)
        assertEquals(127f / 22050f, bar.max, 0.0001f)
    }

    @Test
    fun `a missing sample rate yields no bars`() {
        val w = WaveformJson(sampleRate = 0, length = 1, data = listOf(-100, 100))
        assertTrue(w.toBars(4).isEmpty())
    }

    @Test
    fun `each bar averages its chunk`() {
        val w = waveform(-1000, 1000, -3000, 3000, -5000, 5000, -7000, 7000)
        val bars = w.toBars(2)
        assertEquals(2, bars.size)

        assertEquals(-2000f / 22050f, bars[0].min, 0.0001f)
        assertEquals(2000f / 22050f, bars[0].max, 0.0001f)
        assertEquals(-6000f / 22050f, bars[1].min, 0.0001f)
        assertEquals(6000f / 22050f, bars[1].max, 0.0001f)
    }

    @Test
    fun `silence produces flat bars`() {
        val w = waveform(*IntArray(100) { 0 })
        assertTrue(w.toBars(10).all { it.min == 0f && it.max == 0f })
    }

    @Test
    fun `truncated data does not read past the end`() {
        val w = WaveformJson(sampleRate = 44100, length = 10, data = listOf(-1, 1, -2, 2, -3, 3))
        val bars = w.toBars(3)
        assertEquals(3, bars.size)
    }

    @Test
    fun `values stay clamped even if the source overshoots`() {
        val w = WaveformJson(sampleRate = 44100, length = 1, data = listOf(-99999, 99999))
        val bar = w.toBars(1).single()
        assertTrue(bar.min >= -1f)
        assertTrue(bar.max <= 1f)
    }
}
