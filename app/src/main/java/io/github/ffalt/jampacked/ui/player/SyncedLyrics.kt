package io.github.ffalt.jampacked.ui.player

internal data class TimedLyricLine(
    val timeMs: Long,
    val text: String
)

private val lyricTimestamp = Regex("""\[(\d+):(\d{2})(?:\.(\d{1,3}))?]""")

internal fun parseTimedLyrics(text: String): List<TimedLyricLine>? {
    val lines = mutableListOf<TimedLyricLine>()
    var foundTimestamp = false

    text.lineSequence().forEach { rawLine ->
        var line = rawLine.trimStart()
        val timestamps = mutableListOf<Long>()
        while (true) {
            val match = lyricTimestamp.matchAt(line, 0) ?: break
            val minutes = match.groupValues[1].toLongOrNull() ?: break
            val seconds = match.groupValues[2].toLongOrNull() ?: break
            if (seconds > 59) break
            val milliseconds = match.groupValues[3].padEnd(3, '0').toLong()
            val offsetMs = seconds * 1_000 + milliseconds
            if (minutes > (Long.MAX_VALUE - offsetMs) / 60_000) break
            timestamps += minutes * 60_000 + offsetMs
            line = line.substring(match.range.last + 1).trimStart()
        }

        if (timestamps.isNotEmpty()) {
            foundTimestamp = true
            val lyric = line.trim()
            if (lyric.isNotEmpty()) {
                timestamps.forEach { timestamp -> lines += TimedLyricLine(timestamp, lyric) }
            }
        }
    }

    if (!foundTimestamp) return null
    return lines.sortedBy { it.timeMs }
}

internal fun activeLyricIndex(
    lines: List<TimedLyricLine>,
    positionMs: Long
): Int? = lines.indexOfLast { it.timeMs <= positionMs }.takeIf { it >= 0 }
