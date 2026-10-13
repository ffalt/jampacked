package io.github.ffalt.jampacked.ui.player

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

@Composable
fun PlayerControls(
    isPlaying: Boolean,
    hasPrevious: Boolean,
    hasNext: Boolean,
    onToggle: () -> Unit,
    onPrevious: () -> Unit,
    onNext: () -> Unit,
    onBackward: () -> Unit,
    onForward: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier =
            modifier
                .fillMaxWidth()
                .padding(horizontal = JamDimens.padding),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        ControlButton("step-backward", onPrevious, enabled = hasPrevious)
        ControlButton("backward", onBackward, size = SEEK_ICON, muted = true)
        PlayButton(
            isPlaying = isPlaying,
            onClick = onToggle,
            size = PLAY_BUTTON,
            iconSize = PLAY_ICON
        )
        ControlButton("forward", onForward, size = SEEK_ICON, muted = true)
        ControlButton("step-forward", onNext, enabled = hasNext)
    }
}

@Composable
private fun ControlButton(
    iconName: String,
    onClick: () -> Unit,
    enabled: Boolean = true,
    size: Dp = JamDimens.iconBig,
    muted: Boolean = false
) {
    val colors = LocalJamColors.current
    Box(
        modifier =
            Modifier
                .size(CONTROL_BUTTON)
                .clip(CircleShape)
                .clickable(enabled = enabled, onClick = onClick)
                .alpha(if (enabled) 1f else DISABLED_ALPHA),
        contentAlignment = Alignment.Center
    ) {
        JamIcon(iconName, if (muted) colors.muted else colors.textColor, size = size)
    }
}

private val CONTROL_BUTTON = 50.dp
private val PLAY_BUTTON = 64.dp
private val PLAY_ICON = 26.dp
private val SEEK_ICON = 18.dp
private const val DISABLED_ALPHA = 0.3f
