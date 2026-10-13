package io.github.ffalt.jampacked.data.repo

import kotlinx.serialization.Serializable

@Serializable
data class WaveformJson(
    val version: Int = 2,
    val channels: Int = 1,
    val sampleRate: Int = 44100,
    val samplesPerPixel: Int = 256,
    val bits: Int = 16,
    val length: Int = 0,
    val data: List<Int> = emptyList()
)

data class WaveformBar(
    val min: Float,
    val max: Float
)

fun WaveformJson.toBars(barCount: Int): List<WaveformBar> {
    if (barCount <= 0 || length <= 0 || data.isEmpty()) return emptyList()

    val pairs = minOf(length, data.size / 2)
    if (pairs == 0) return emptyList()

    val fullScale = (sampleRate / 2).toFloat()
    if (fullScale <= 0f) return emptyList()
    val bars = ArrayList<WaveformBar>(barCount)

    for (bar in 0 until barCount) {
        val start = (bar.toLong() * pairs / barCount).toInt()
        val end = (((bar + 1).toLong() * pairs / barCount).toInt()).coerceAtLeast(start + 1)

        var minSum = 0L
        var maxSum = 0L
        var count = 0
        for (i in start until minOf(end, pairs)) {
            minSum += data[i * 2]
            maxSum += data[i * 2 + 1]
            count++
        }
        if (count == 0) {
            bars.add(WaveformBar(0f, 0f))
            continue
        }
        bars.add(
            WaveformBar(
                min = (minSum.toFloat() / count / fullScale).coerceIn(-1f, 1f),
                max = (maxSum.toFloat() / count / fullScale).coerceIn(-1f, 1f)
            )
        )
    }
    return bars
}
