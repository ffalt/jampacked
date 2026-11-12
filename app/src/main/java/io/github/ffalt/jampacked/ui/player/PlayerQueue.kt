package io.github.ffalt.jampacked.ui.player

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.res.pluralStringResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.zIndex
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.player.PlayerState
import io.github.ffalt.jampacked.ui.components.Separator
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamStyles
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
        QueueEmpty(modifier = modifier)
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
                .padding(horizontal = JamDimens.padding, vertical = JamDimens.paddingSmall),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ThemedText(
            text =
                buildString {
                    append(pluralStringResource(R.plurals.queue_summary, queue.size, queue.size))
                    if (total > 0) append(" · ${formatDuration(total)}")
                },
            color = colors.muted,
            fontSize = JamDimens.fontSizeSmall,
            maxLines = 1,
            modifier = Modifier.weight(1f)
        )
        QueueAction("shuffle", stringResource(R.string.shuffle), onShuffle)
        Spacer(modifier = Modifier.width(JamDimens.marginSmall))
        QueueAction("trash", stringResource(R.string.clear), onClear)
    }
}

@Composable
private fun QueueAction(
    iconName: String,
    label: String,
    onClick: () -> Unit
) {
    val colors = LocalJamColors.current
    Row(
        modifier =
            Modifier
                .clip(RoundedCornerShape(percent = 50))
                .background(colors.itemBackground)
                .clickable(onClick = onClick)
                .padding(horizontal = JamDimens.padding, vertical = JamDimens.paddingSmall),
        verticalAlignment = Alignment.CenterVertically
    ) {
        JamIcon(
            name = iconName,
            color = colors.textColor.copy(alpha = JamStyles.ICON_ALPHA),
            size = JamDimens.icon
        )
        ThemedText(
            text = label,
            fontSize = JamDimens.fontSizeSmall,
            maxLines = 1,
            modifier = Modifier.padding(start = JamDimens.marginSmall)
        )
    }
}

@Composable
private fun QueueEmpty(modifier: Modifier = Modifier) {
    val colors = LocalJamColors.current
    Column(
        modifier =
            modifier
                .fillMaxSize()
                .padding(top = EMPTY_TOP),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Top
    ) {
        JamIcon("queue", colors.textColor.copy(alpha = JamStyles.ICON_ALPHA), size = EMPTY_ICON)
        ThemedText(
            text = stringResource(R.string.no_entries),
            color = colors.muted,
            letterSpacing = EMPTY_LETTER_SPACING,
            modifier = Modifier.padding(top = JamDimens.paddingLarge)
        )
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

private val EMPTY_TOP = 80.dp
private val EMPTY_ICON = 48.dp
private val EMPTY_LETTER_SPACING = 2.sp
