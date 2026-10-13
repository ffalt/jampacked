package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import io.github.ffalt.jampacked.data.repo.WaveformJson
import io.github.ffalt.jampacked.data.repo.toBars
import kotlin.math.max
import kotlin.math.roundToInt

@Composable
fun Waveform(
    waveform: WaveformJson?,
    progress: Float,
    playableProgress: Float,
    activeColor: Color,
    playableColor: Color,
    inactiveColor: Color,
    onSeek: (Float) -> Unit,
    modifier: Modifier = Modifier,
    height: Dp = 64.dp,
    barWidth: Dp = 2.dp,
    barGap: Dp = 1.dp,
    handleColor: Color? = null
) {
    var scrubbing by remember { mutableFloatStateOf(-1f) }
    val shown = if (scrubbing >= 0f) scrubbing else progress

    Canvas(
        modifier =
            modifier
                .fillMaxWidth()
                .height(height)
                .pointerInput(Unit) {
                    detectTapGestures { offset ->
                        onSeek((offset.x / size.width).coerceIn(0f, 1f))
                    }
                }.pointerInput(Unit) {
                    detectHorizontalDragGestures(
                        onDragStart = { offset ->
                            scrubbing = (offset.x / size.width).coerceIn(0f, 1f)
                        },
                        onDragEnd = {
                            if (scrubbing >= 0f) onSeek(scrubbing)
                            scrubbing = -1f
                        },
                        onDragCancel = { scrubbing = -1f }
                    ) { change, _ ->
                        scrubbing = (change.position.x / size.width).coerceIn(0f, 1f)
                    }
                }
    ) {
        if (waveform == null) return@Canvas

        val stride = (barWidth.toPx() + barGap.toPx()).coerceAtLeast(1f)
        val barCount = max(1, (size.width / stride).roundToInt())
        val bars = waveform.toBars(barCount)
        if (bars.isEmpty()) return@Canvas

        val centre = size.height / 2f
        bars.forEachIndexed { index, bar ->
            val fraction = index.toFloat() / bars.size
            val color =
                when {
                    fraction < shown -> activeColor
                    fraction < playableProgress -> playableColor
                    else -> inactiveColor
                }
            val top = centre - (bar.max * centre)
            val bottom = centre - (bar.min * centre)
            drawRect(
                color = color,
                topLeft = Offset(index * stride, top),
                size = Size(barWidth.toPx(), max(1f, bottom - top))
            )
        }

        if (handleColor != null) {
            val x =
                (size.width * shown.coerceIn(0f, 1f))
                    .coerceIn(0f, size.width - HANDLE_WIDTH.toPx())
            drawRect(
                color = handleColor,
                topLeft = Offset(x, 0f),
                size = Size(HANDLE_WIDTH.toPx(), size.height)
            )
        }
    }
}

private val HANDLE_WIDTH = 2.dp
