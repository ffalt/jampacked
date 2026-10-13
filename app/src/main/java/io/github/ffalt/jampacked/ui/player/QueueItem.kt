package io.github.ffalt.jampacked.ui.player

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectVerticalDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.ui.components.ClickIcon
import io.github.ffalt.jampacked.ui.components.DurationText
import io.github.ffalt.jampacked.ui.components.FavIcon
import io.github.ffalt.jampacked.ui.components.JamImage
import io.github.ffalt.jampacked.ui.components.PinIcon
import io.github.ffalt.jampacked.ui.components.SwipeableItem
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamStyles
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

@Composable
fun QueueItem(
    session: JamSession,
    track: TrackEntry,
    index: Int,
    active: Boolean,
    dragging: Boolean,
    showCover: Boolean,
    onPlay: () -> Unit,
    onRemove: () -> Unit,
    onDragStart: (Int) -> Unit,
    onDrag: (Float) -> Unit,
    onDragEnd: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    // The row keeps moving while it is dragged, so the handle reads the index it has right now
    // rather than the one it was composed with - re-keying the gesture would cancel the drag.
    val currentIndex by rememberUpdatedState(index)

    SwipeableItem(
        modifier = modifier,
        actions = {
            PinIcon(
                id = track.id,
                objType = "track",
                name = track.title,
                tracks = listOf(track),
                size = ITEM_BUTTON_ICON,
                modifier = Modifier.width(ITEM_BUTTON)
            )
            FavIcon(
                id = track.id,
                size = ITEM_BUTTON_ICON,
                modifier = Modifier.width(ITEM_BUTTON)
            )
            ClickIcon(
                iconName = "remove",
                onClick = onRemove,
                size = ITEM_BUTTON_ICON,
                modifier = Modifier.width(ITEM_BUTTON)
            )
        }
    ) {
        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .height(JamStyles.itemHeight)
                    .background(
                        when {
                            dragging -> colors.control
                            active -> colors.activeBackgroundColor
                            else -> colors.background
                        }
                    ).clickable(onClick = onPlay)
                    .clipToBounds(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier =
                    Modifier
                        .width(MARKER_WIDTH)
                        .fillMaxHeight()
                        .background(if (active) colors.navPrimary else colors.background)
            )

            // A queue holding a single album would repeat the same cover down the whole list,
            // which says nothing - there the position in the queue is the useful thing to show.
            if (showCover) {
                Box(modifier = Modifier.padding(horizontal = JamDimens.padding)) {
                    JamImage(
                        session = session,
                        id = track.id,
                        size = JamDimens.thumb,
                        modifier =
                            Modifier
                                .clip(RoundedCornerShape(THUMB_RADIUS))
                                .border(1.dp, colors.coverBorder, RoundedCornerShape(THUMB_RADIUS))
                    )
                }
            } else {
                Box(
                    modifier = Modifier.width(POSITION_COLUMN),
                    contentAlignment = Alignment.Center
                ) {
                    if (active) {
                        JamIcon("play", colors.navPrimary, size = JamDimens.icon)
                    } else {
                        ThemedText(
                            text = "${index + 1}",
                            color = colors.muted,
                            fontSize = JamDimens.fontSizeSmall
                        )
                    }
                }
            }

            Column(modifier = Modifier.weight(1f)) {
                ThemedText(
                    text = track.title,
                    maxLines = 1,
                    lineHeight = TITLE_LINE_HEIGHT
                )
                ThemedText(
                    text = track.artist,
                    color = colors.muted,
                    fontSize = JamDimens.fontSizeSmall,
                    maxLines = 1,
                    lineHeight = ARTIST_LINE_HEIGHT
                )
            }

            DurationText(
                durationMs = track.durationMS,
                fontSize = JamDimens.fontSizeSmall,
                color = colors.muted,
                textAlign = TextAlign.End,
                maxLines = 1,
                modifier = Modifier.padding(start = JamDimens.paddingSmall)
            )

            Box(
                modifier =
                    Modifier
                        .size(HANDLE_WIDTH, JamStyles.itemHeight)
                        .pointerInput(Unit) {
                            detectVerticalDragGestures(
                                onDragStart = { onDragStart(currentIndex) },
                                onDragEnd = onDragEnd,
                                onDragCancel = onDragEnd
                            ) { change, amount ->
                                change.consume()
                                onDrag(amount)
                            }
                        },
                contentAlignment = Alignment.Center
            ) {
                JamIcon("menu", colors.muted, size = JamDimens.iconLarge)
            }
        }
    }
}

private val MARKER_WIDTH = 3.dp
private val POSITION_COLUMN = 44.dp
private val HANDLE_WIDTH = 44.dp
private val THUMB_RADIUS = 4.dp
private val TITLE_LINE_HEIGHT = 18.sp
private val ARTIST_LINE_HEIGHT = 15.sp

private val ITEM_BUTTON = 50.dp
private val ITEM_BUTTON_ICON = 22.dp
