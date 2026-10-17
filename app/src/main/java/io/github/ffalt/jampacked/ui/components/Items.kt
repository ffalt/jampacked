package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamStyles
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

@Composable
fun JamItem(
    session: JamSession,
    id: String,
    title: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    onClick: (() -> Unit)? = null,
    onLongClick: (() -> Unit)? = null,
    trailing: @Composable (() -> Unit)? = null
) {
    val colors = LocalJamColors.current
    val gestures =
        when {
            onLongClick != null -> {
                Modifier.combinedClickable(onClick = onClick ?: {}, onLongClick = onLongClick)
            }

            onClick != null -> {
                Modifier.clickable(onClick = onClick)
            }

            else -> {
                Modifier
            }
        }
    Row(
        modifier =
            modifier
                .fillMaxWidth()
                .height(JamStyles.itemHeight)
                .clipToBounds()
                .then(gestures)
                .padding(horizontal = JamDimens.padding),
        verticalAlignment = Alignment.CenterVertically
    ) {
        JamThumb(session = session, id = id, modifier = Modifier.padding(end = JamDimens.margin))
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.Center
        ) {
            ThemedText(title, maxLines = 2, lineHeight = TITLE_LINE_HEIGHT)
            if (!description.isNullOrEmpty()) {
                ThemedText(
                    description,
                    color = colors.textColor.copy(alpha = JamStyles.footerAlpha),
                    fontSize = JamDimens.fontSizeSmall,
                    maxLines = 1,
                    lineHeight = DESCRIPTION_LINE_HEIGHT
                )
            }
        }
        trailing?.invoke()
    }
}

@Composable
fun TrackItem(
    track: TrackEntry,
    modifier: Modifier = Modifier,
    showCheck: Boolean = false,
    isSelected: Boolean = false,
    isCurrent: Boolean = false,
    showArtist: Boolean = true,
    showTrackNr: Boolean = true,
    onClick: (() -> Unit)? = null
) {
    val colors = LocalJamColors.current
    Row(
        modifier =
            modifier
                .fillMaxWidth()
                .height(JamStyles.itemHeight)
                .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
                .padding(horizontal = JamDimens.padding),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (showCheck) {
            Box(modifier = Modifier.width(32.dp)) {
                ThemedCheckbox(checked = isSelected)
            }
        }
        if (showTrackNr && track.trackNr.isNotEmpty()) {
            ThemedText(
                text = track.trackNr,
                color = colors.muted,
                fontSize = JamDimens.fontSizeSmall,
                textAlign = TextAlign.End,
                maxLines = 1,
                modifier =
                    Modifier
                        .weight(1f)
                        .padding(end = JamDimens.margin)
            )
        }
        Column(modifier = Modifier.weight(7f)) {
            ThemedText(
                text = track.title,
                color = if (isCurrent) colors.activeTintColor else colors.textColor,
                maxLines = 1
            )
            if (showArtist && track.artist.isNotEmpty()) {
                ThemedText(
                    text = track.artist,
                    color = colors.textColor.copy(alpha = JamStyles.footerAlpha),
                    fontSize = JamDimens.fontSizeSmall,
                    maxLines = 1
                )
            }
        }
        Spacer(Modifier.width(JamDimens.paddingSmall))
        if (track.durationMS > 0) {
            DurationText(
                durationMs = track.durationMS,
                color = colors.muted,
                fontSize = JamDimens.fontSizeSmall,
                textAlign = TextAlign.End,
                maxLines = 1
            )
        }
    }
}

private val TITLE_LINE_HEIGHT = 20.sp
private val DESCRIPTION_LINE_HEIGHT = 16.sp
