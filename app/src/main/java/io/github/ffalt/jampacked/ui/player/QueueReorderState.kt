package io.github.ffalt.jampacked.ui.player

import androidx.compose.foundation.gestures.scrollBy
import androidx.compose.foundation.lazy.LazyListItemInfo
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp

@Stable
class QueueReorderState internal constructor(
    private val listState: LazyListState,
    private val edgePx: Float,
    private val stepPx: Float,
    private val onMove: (Int, Int) -> Unit
) {
    var draggingIndex by mutableIntStateOf(NO_INDEX)
        private set

    private var pointerY by mutableFloatStateOf(0f)

    val dragging: Boolean get() = draggingIndex != NO_INDEX

    fun translationFor(index: Int): Float {
        if (index != draggingIndex) return 0f
        val info = itemInfo(index) ?: return 0f
        return pointerY - (info.offset + info.size / 2f)
    }

    fun start(index: Int) {
        val info = itemInfo(index) ?: return
        draggingIndex = index
        pointerY = info.offset + info.size / 2f
    }

    fun drag(amount: Float) {
        if (!dragging) return
        pointerY += amount
        swapUnderFinger()
    }

    fun stop() {
        draggingIndex = NO_INDEX
    }

    /** One frame of edge scrolling, so a row can be dragged past the end of the viewport. */
    suspend fun autoScroll() {
        if (!dragging) return
        val info = listState.layoutInfo
        val top = info.viewportStartOffset + edgePx
        val bottom = info.viewportEndOffset - edgePx
        val delta =
            when {
                pointerY < top -> -(top - pointerY).coerceAtMost(stepPx)
                pointerY > bottom -> (pointerY - bottom).coerceAtMost(stepPx)
                else -> return
            }
        listState.scrollBy(delta)
        swapUnderFinger()
    }

    private fun swapUnderFinger() {
        val target =
            listState.layoutInfo.visibleItemsInfo.firstOrNull { item ->
                item.index != draggingIndex && pointerY >= item.offset && pointerY <= item.offset + item.size
            } ?: return
        onMove(draggingIndex, target.index)
        draggingIndex = target.index
    }

    private fun itemInfo(index: Int): LazyListItemInfo? = listState.layoutInfo.visibleItemsInfo.firstOrNull { it.index == index }

    companion object {
        const val NO_INDEX: Int = -1
    }
}

@Composable
fun rememberQueueReorder(
    listState: LazyListState,
    onMove: (Int, Int) -> Unit
): QueueReorderState {
    val density = LocalDensity.current
    val move by rememberUpdatedState(onMove)
    return remember(listState, density) {
        QueueReorderState(
            listState = listState,
            edgePx = with(density) { AUTO_SCROLL_EDGE.toPx() },
            stepPx = with(density) { AUTO_SCROLL_STEP.toPx() },
            onMove = { from, to -> move(from, to) }
        )
    }
}

private val AUTO_SCROLL_EDGE = 72.dp
private val AUTO_SCROLL_STEP = 12.dp
