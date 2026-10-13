package io.github.ffalt.jampacked.ui.player

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.res.pluralStringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.player.PlayerState
import io.github.ffalt.jampacked.ui.components.ClickLabelIcon
import io.github.ffalt.jampacked.ui.components.ListEmpty
import io.github.ffalt.jampacked.ui.components.Separator
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import io.github.ffalt.jampacked.util.formatDuration

@Composable
fun PlayerQueue(
    session: JamSession,
    state: PlayerState,
    onSkipTo: (Int) -> Unit,
    onRemove: (Int) -> Unit,
    onMove: (Int, Int) -> Unit,
    onClear: () -> Unit,
    onShuffle: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (state.queue.isEmpty()) {
        ListEmpty(items = emptyList<String>(), modifier = modifier)
        return
    }

    val listState = rememberLazyListState()
    val reorder = rememberQueueReorder(listState, onMove)
    val keys = remember(state.queue) { queueKeys(state.queue) }
    val showCovers =
        remember(state.queue) {
            state.queue.distinctBy { it.albumID ?: it.album }.size > 1
        }

    LaunchedEffect(reorder.dragging) {
        while (reorder.dragging) {
            reorder.autoScroll()
            withFrameNanos { }
        }
    }

    Column(modifier = modifier) {
        QueueSummary(queue = state.queue, onClear = onClear, onShuffle = onShuffle)
        Separator()
        LazyColumn(state = listState, modifier = Modifier.fillMaxWidth()) {
            itemsIndexed(state.queue, key = { index, _ -> keys[index] }) { index, track ->
                val dragging = reorder.draggingIndex == index
                QueueItem(
                    session = session,
                    track = track,
                    index = index,
                    active = index == state.currentIndex,
                    dragging = dragging,
                    showCover = showCovers,
                    onPlay = { onSkipTo(index) },
                    onRemove = { onRemove(index) },
                    onDragStart = reorder::start,
                    onDrag = reorder::drag,
                    onDragEnd = reorder::stop,
                    modifier =
                        Modifier
                            .zIndex(if (dragging) 1f else 0f)
                            .graphicsLayer { translationY = reorder.translationFor(index) }
                            .then(if (dragging) Modifier else Modifier.animateItem())
                )
                if (index < state.queue.lastIndex) Separator()
            }
        }
    }
}

@Composable
private fun QueueSummary(
    queue: List<TrackEntry>,
    onClear: () -> Unit,
    onShuffle: () -> Unit
) {
    val colors = LocalJamColors.current
    val total = remember(queue) { queue.sumOf { it.durationMS } }
    Row(
        modifier =
            Modifier
                .fillMaxWidth()
                .height(SUMMARY_HEIGHT)
                .padding(horizontal = JamDimens.padding),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        ThemedText(
            text =
                buildString {
                    append(pluralStringResource(R.plurals.queue_summary, queue.size, queue.size))
                    if (total > 0) append(" · ${formatDuration(total)}")
                },
            color = colors.muted,
            fontSize = JamDimens.fontSizeSmall,
            maxLines = 1
        )
        Row(verticalAlignment = Alignment.CenterVertically) {
            ClickLabelIcon(
                iconName = "shuffle",
                label =
                    androidx.compose.ui.res
                        .stringResource(R.string.shuffle),
                onClick = onShuffle
            )
            ClickLabelIcon(
                iconName = "trash",
                label =
                    androidx.compose.ui.res
                        .stringResource(R.string.clear),
                onClick = onClear,
                modifier = Modifier.padding(start = JamDimens.padding)
            )
        }
    }
}

/** Stable per-row keys: the same track can sit in the queue more than once. */
private fun queueKeys(queue: List<TrackEntry>): List<String> {
    val seen = mutableMapOf<String, Int>()
    return queue.map { track ->
        val repeat = seen.getOrElse(track.id) { 0 }
        seen[track.id] = repeat + 1
        if (repeat == 0) track.id else "${track.id}#$repeat"
    }
}

private val SUMMARY_HEIGHT = 44.dp
