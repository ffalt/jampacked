package io.github.ffalt.jampacked.util

import java.util.Locale
import kotlin.math.floor
import kotlin.math.roundToLong

fun formatDuration(ms: Long?): String {
    if (ms == null) return ""
    var delta = ms / 1000.0

    val days = floor(delta / 86_400).toLong()
    delta -= days * 86_400
    val hours = (floor(delta / 3600).toLong()) % 24
    delta -= hours * 3600
    val minutes = (floor(delta / 60).toLong()) % 60
    delta -= minutes * 60
    val seconds = (delta % 60).roundToLong()

    return buildString {
        if (days > 0) append("${days}d ")
        if (hours > 0) {
            if (isNotEmpty()) append("${pad(hours)}:") else append("$hours:")
        }
        append(pad(minutes))
        append(":${pad(seconds)}")
    }
}

private fun pad(value: Long): String = if (value <= 9) "0$value" else value.toString()

fun humanFileSize(bytes: Long): String {
    if (bytes < 1024) return "$bytes B"
    val units = listOf("KiB", "MiB", "GiB", "TiB")
    var value = bytes.toDouble() / 1024
    var unit = 0
    while (value >= 1024 && unit < units.lastIndex) {
        value /= 1024
        unit++
    }

    return "%.1f %s".format(Locale.ROOT, value, units[unit])
}
