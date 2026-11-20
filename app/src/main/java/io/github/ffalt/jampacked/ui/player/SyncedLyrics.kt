package io.github.ffalt.jampacked.ui.player

import io.github.ffalt.jampacked.data.repo.LyricsLine

internal fun activeLyricIndex(
    lines: List<LyricsLine>,
    positionMs: Long
): Int? = lines.indexOfLast { it.timeMs <= positionMs }.takeIf { it >= 0 }
