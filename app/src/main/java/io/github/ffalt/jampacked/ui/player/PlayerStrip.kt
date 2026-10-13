package io.github.ffalt.jampacked.ui.player

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.JamThumb
import io.github.ffalt.jampacked.ui.components.Separator
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

@Composable
fun PlayerStrip(
    session: JamSession,
    onOpen: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: PlayerViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val track = state.current ?: return
    val colors = LocalJamColors.current

    Column(
        modifier =
            modifier
                .fillMaxWidth()
                .background(colors.control)
    ) {
        Separator()
        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .height(STRIP_HEIGHT)
                    .clickable(onClick = onOpen)
                    .pointerInput(track.id) {
                        var travelled = 0f
                        detectHorizontalDragGestures(
                            onDragStart = { travelled = 0f },
                            onDragEnd = {
                                val threshold = SWIPE_TRACK.toPx()
                                if (travelled > threshold) viewModel.previous()
                                if (travelled < -threshold) viewModel.next()
                            }
                        ) { _, amount -> travelled += amount }
                    }.padding(horizontal = JamDimens.padding),
            verticalAlignment = Alignment.CenterVertically
        ) {
            JamThumb(
                session = session,
                id = track.id,
                modifier =
                    Modifier
                        .clip(RoundedCornerShape(THUMB_RADIUS))
                        .border(1.dp, colors.coverBorder, RoundedCornerShape(THUMB_RADIUS))
            )
            Column(
                modifier =
                    Modifier
                        .weight(1f)
                        .padding(horizontal = JamDimens.padding)
            ) {
                ThemedText(track.title, maxLines = 1, lineHeight = TITLE_LINE_HEIGHT)
                ThemedText(
                    text = track.artist,
                    color = colors.muted,
                    fontSize = JamDimens.fontSizeSmall,
                    maxLines = 1,
                    lineHeight = ARTIST_LINE_HEIGHT
                )
            }

            StripButton(
                iconName = "step-backward",
                onClick = viewModel::previous,
                enabled = state.currentIndex > 0
            )
            PlayButton(
                isPlaying = state.isPlaying,
                onClick = viewModel::toggle,
                size = PLAY_BUTTON_SIZE,
                iconSize = PLAY_BUTTON_ICON_SIZE
            )
            StripButton(
                iconName = "step-forward",
                onClick = viewModel::next,
                enabled = state.currentIndex < state.queue.size - 1
            )
        }
        MiniProgressBar(
            progress =
                if (state.durationMs > 0) {
                    state.positionMs.toFloat() / state.durationMs
                } else {
                    0f
                }
        )
    }
}

@Composable
private fun StripButton(
    iconName: String,
    onClick: () -> Unit,
    enabled: Boolean = true
) {
    val colors = LocalJamColors.current
    Box(
        modifier =
            Modifier
                .size(STRIP_BUTTON)
                .clip(CircleShape)
                .clickable(enabled = enabled, onClick = onClick)
                .alpha(if (enabled) 1f else DISABLED_ALPHA),
        contentAlignment = Alignment.Center
    ) {
        JamIcon(iconName, colors.textColor, size = JamDimens.iconLarge)
    }
}

@Composable
fun PlayButton(
    isPlaying: Boolean,
    onClick: () -> Unit,
    size: Dp = PLAY_BUTTON_SIZE,
    background: Color = LocalJamColors.current.navPrimary,
    iconColor: Color = Color.White,
    iconSize: Dp = PLAY_BUTTON_ICON_SIZE
) {
    Box(
        modifier =
            Modifier
                .size(size)
                .clip(CircleShape)
                .background(background)
                .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        JamIcon(
            name = if (isPlaying) "pause" else "play",
            color = iconColor,
            size = iconSize,
            modifier = if (isPlaying) Modifier else Modifier.padding(start = 3.dp)
        )
    }
}

@Composable
private fun MiniProgressBar(progress: Float) {
    val colors = LocalJamColors.current
    Box(
        modifier =
            Modifier
                .fillMaxWidth()
                .height(PROGRESS_HEIGHT)
                .background(colors.separator)
    ) {
        Box(
            modifier =
                Modifier
                    .fillMaxWidth(progress.coerceIn(0f, 1f))
                    .height(PROGRESS_HEIGHT)
                    .background(colors.navPrimary)
        )
    }
}

private val STRIP_HEIGHT = 64.dp
private val STRIP_BUTTON = 42.dp
private val PLAY_BUTTON_SIZE = 44.dp
private val PLAY_BUTTON_ICON_SIZE = 18.dp
private val THUMB_RADIUS = 4.dp
private val PROGRESS_HEIGHT = 2.dp
private val SWIPE_TRACK = 60.dp
private val TITLE_LINE_HEIGHT = 18.sp
private val ARTIST_LINE_HEIGHT = 15.sp
private const val DISABLED_ALPHA = 0.3f
