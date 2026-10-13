package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp
import kotlin.math.abs

fun Modifier.swipeBetweenPages(
    onPrevious: (() -> Unit)?,
    onNext: (() -> Unit)?
): Modifier {
    if (onPrevious == null && onNext == null) return this
    return pointerInput(onPrevious, onNext) {
        var dragged = 0f
        val threshold = SWIPE_THRESHOLD.toPx()
        detectHorizontalDragGestures(
            onDragStart = { dragged = 0f },
            onDragEnd = {
                when {
                    dragged <= -threshold -> onNext?.invoke()
                    dragged >= threshold -> onPrevious?.invoke()
                }
            }
        ) { change, amount ->
            dragged += amount

            if (abs(dragged) > threshold / 2) change.consume()
        }
    }
}

private val SWIPE_THRESHOLD = 72.dp
