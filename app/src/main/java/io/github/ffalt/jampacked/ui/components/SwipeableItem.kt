package io.github.ffalt.jampacked.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.layout.layout
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

@Composable
fun SwipeableItem(
    modifier: Modifier = Modifier,
    actions: @Composable RowScope.() -> Unit,
    content: @Composable () -> Unit
) {
    val colors = LocalJamColors.current
    val scope = rememberCoroutineScope()
    val offset = remember { Animatable(0f) }
    val openPx = with(LocalDensity.current) { OPEN_WIDTH.toPx() }
    val thresholdPx = with(LocalDensity.current) { THRESHOLD.toPx() }

    val progress = (-offset.value / openPx).coerceIn(0f, 1f)

    Box(modifier = modifier.fillMaxWidth()) {
        Box(
            modifier =
                Modifier
                    .matchParentSize()
                    .background(colors.control)
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null
                    ) { scope.launch { offset.animateTo(0f) } },
            contentAlignment = Alignment.CenterEnd
        ) {
            Row(
                modifier = Modifier.scale(progress),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically,
                content = actions
            )
        }

        Box(
            modifier =
                Modifier
                    .offsetX { offset.value.roundToInt() }
                    .draggable(
                        orientation = Orientation.Horizontal,
                        state =
                            rememberDraggableState { delta ->
                                scope.launch {
                                    offset.snapTo((offset.value + delta / FRICTION).coerceIn(-openPx, 0f))
                                }
                            },
                        onDragStopped = {
                            scope.launch {
                                offset.animateTo(if (offset.value < -thresholdPx) -openPx else 0f)
                            }
                        }
                    )
        ) {
            content()
        }
    }
}

private fun Modifier.offsetX(x: () -> Int): Modifier =
    layout { measurable, constraints ->
        val placeable = measurable.measure(constraints)
        layout(placeable.width, placeable.height) {
            placeable.placeRelative(IntOffset(x(), 0))
        }
    }

private val OPEN_WIDTH = 150.dp

private val THRESHOLD = 40.dp

private const val FRICTION = 2f
