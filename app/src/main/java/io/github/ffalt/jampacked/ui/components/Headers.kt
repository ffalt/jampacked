package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

data class HeaderDetail(
    val title: String,
    val value: String,
    val onClick: (() -> Unit)? = null
)

@Composable
fun ObjectHeader(
    session: JamSession,
    id: String,
    title: String,
    modifier: Modifier = Modifier,
    typeName: String? = null,
    details: List<HeaderDetail> = emptyList(),
    onPlay: (() -> Unit)? = null,
    sheetActions: @Composable (() -> Unit)? = null,
    customDetails: @Composable (() -> Unit)? = null
) {
    val colors = LocalJamColors.current
    var sheetOpen by remember { mutableStateOf(false) }

    JamBackgroundImage(
        session = session,
        id = id,
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(
                        start = JamDimens.paddingLarge,
                        top = JamDimens.paddingLarge,
                        bottom = JamDimens.paddingLarge,
                        // The overflow button carries its own padding; trimming the gutter by that
                        // much puts its glyph on the same edge as the cover.
                        end = JamDimens.paddingLarge - JamDimens.paddingSmall
                    )
        ) {
            JamImage(
                session = session,
                id = id,
                size = COVER_SIZE,
                requestSize = 300,
                modifier =
                    Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .border(1.dp, colors.coverBorder, RoundedCornerShape(6.dp))
            )
            Column(
                modifier =
                    Modifier
                        .weight(1f)
                        .padding(start = JamDimens.paddingLarge)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    ThemedText(
                        text = typeName.orEmpty().uppercase(),
                        color = colors.muted,
                        fontSize = JamDimens.fontSizeTiny,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 2.sp,
                        maxLines = 1,
                        modifier = Modifier.weight(1f)
                    )
                    ClickIcon(
                        iconName = "ellipsis-vert",
                        onClick = { sheetOpen = true },
                        size = HEADER_ICON
                    )
                }
                ThemedText(
                    text = title,
                    fontSize = JamDimens.fontSizeBig,
                    fontWeight = FontWeight.Bold,
                    lineHeight = TITLE_LINE_HEIGHT,
                    maxLines = 2,
                    modifier = Modifier.padding(top = JamDimens.paddingSmall)
                )

                if (details.isNotEmpty()) {
                    HeaderDetails(details)
                }
                customDetails?.let {
                    // The extra end padding puts this on the same edge as the overflow glyph
                    // above it, which the Row's trimmed gutter has already accounted for.
                    Box(
                        modifier =
                            Modifier
                                .fillMaxWidth()
                                .padding(top = JamDimens.paddingSmall, end = JamDimens.paddingSmall),
                        contentAlignment = Alignment.CenterEnd
                    ) { it() }
                }

                // Every control is the same glyph in the same box; only the tint says which one
                // is the main action. Rating and favourite live behind the overflow, the way the
                // player keeps them.
                onPlay?.let {
                    ClickIcon(
                        iconName = "play",
                        onClick = it,
                        size = HEADER_ICON,
                        color = colors.navPrimary,
                        modifier = Modifier.padding(top = JamDimens.padding)
                    )
                }
            }
        }
    }

    if (sheetOpen) {
        HeaderSheet(
            id = id,
            actions = sheetActions,
            onDismiss = { sheetOpen = false }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun HeaderSheet(
    id: String,
    actions: @Composable (() -> Unit)?,
    onDismiss: () -> Unit
) {
    val colors = LocalJamColors.current
    ModalBottomSheet(onDismissRequest = onDismiss, containerColor = colors.background) {
        Column(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = JamDimens.paddingLarge)
                    .padding(bottom = SHEET_BOTTOM)
        ) {
            ThemedText(
                text = stringResource(R.string.rating).uppercase(),
                color = colors.muted,
                fontSize = JamDimens.fontSizeTiny,
                letterSpacing = 1.sp
            )
            Rating(
                id = id,
                size = SHEET_ICON,
                fillWidth = false,
                modifier = Modifier.padding(top = JamDimens.padding)
            )

            Spacer(modifier = Modifier.height(JamDimens.marginLarge))
            Separator()
            Spacer(modifier = Modifier.height(JamDimens.marginSmall))

            FavIcon(
                id = id,
                size = JamDimens.iconLarge,
                label = stringResource(R.string.favorite_action),
                modifier = HEADER_SHEET_ROW
            )
            actions?.invoke()
        }
    }
}

/**
 * The facts read as one sentence rather than a label column: a count says "51 albums", anything
 * else just says what it is. Whatever carries a target stays tappable.
 */
@Composable
private fun HeaderDetails(details: List<HeaderDetail>) {
    val colors = LocalJamColors.current
    // The facts are spaced apart rather than punctuated: any separator between them strands a
    // glyph at the start or the end of a line as soon as the column is too narrow to hold them.
    FlowRow(
        modifier = Modifier.padding(top = JamDimens.paddingSmall),
        horizontalArrangement = Arrangement.spacedBy(JamDimens.paddingLarge),
        verticalArrangement = Arrangement.spacedBy(JamDimens.paddingSmall)
    ) {
        details.forEach { detail ->
            ThemedText(
                text = detail.inline(),
                color = if (detail.onClick != null) colors.textColor else colors.muted,
                fontSize = JamDimens.fontSizeSmall,
                maxLines = 1,
                modifier = detail.onClick?.let { Modifier.clickable(onClick = it) } ?: Modifier
            )
        }
    }
}

/**
 * A control in the header has to look like one: the facts above it are muted text too, so only the
 * outline says this line can be tapped.
 */
@Composable
fun HeaderAction(
    iconName: String,
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    val shape = RoundedCornerShape(ACTION_CORNER)
    Row(
        modifier =
            modifier
                .clip(shape)
                .border(1.dp, colors.coverBorder, shape)
                .clickable(onClick = onClick)
                .padding(horizontal = JamDimens.padding, vertical = JamDimens.paddingSmall),
        verticalAlignment = Alignment.CenterVertically
    ) {
        JamIcon(iconName, colors.muted, size = JamDimens.iconSmall)
        ThemedText(
            text = label,
            color = colors.muted,
            fontSize = JamDimens.fontSizeSmall,
            maxLines = 1,
            modifier = Modifier.padding(start = JamDimens.paddingSmall)
        )
    }
}

private val ACTION_CORNER = 14.dp

private fun HeaderDetail.inline(): String {
    val isCount = value.isNotEmpty() && value.all { it.isDigit() } && title.endsWith("s")
    return if (isCount) "$value ${title.lowercase()}" else value
}

val HEADER_ICON = 26.dp

/** Keeps every row of the header overflow sheet on the same rhythm. */
val HEADER_SHEET_ROW: Modifier =
    Modifier
        .fillMaxWidth()
        .padding(vertical = JamDimens.paddingSmall)

private val SHEET_ICON = 26.dp
private val SHEET_BOTTOM = 30.dp

private val TITLE_LINE_HEIGHT = 28.sp

private val COVER_SIZE = 150.dp

@Composable
fun PageHeader(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    subtitleIcon: String? = null,
    onSubtitleClick: (() -> Unit)? = null,
    leading: @Composable (() -> Unit)? = null,
    trailing: @Composable (() -> Unit)? = null
) {
    val colors = LocalJamColors.current

    Row(
        modifier =
            modifier
                .fillMaxWidth()
                .height(JamDimens.pageHeaderHeight),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(modifier = Modifier.width(40.dp), contentAlignment = Alignment.Center) {
            leading?.invoke()
        }
        Column(
            modifier = Modifier.weight(1f),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            subtitle?.let {
                PageSubtitle(
                    text = it,
                    iconName = subtitleIcon,
                    onClick = onSubtitleClick
                )
            }
            ThemedText(title, fontSize = JamDimens.fontSizeHuge, maxLines = 1)
        }
        Box(modifier = Modifier.width(40.dp), contentAlignment = Alignment.Center) {
            trailing?.invoke()
        }
    }
}

@Composable
private fun PageSubtitle(
    text: String,
    iconName: String?,
    onClick: (() -> Unit)?
) {
    val colors = LocalJamColors.current
    Row(
        modifier =
            Modifier
                .clip(RoundedCornerShape(4.dp))
                .then(onClick?.let { Modifier.clickable(onClick = it) } ?: Modifier)
                .padding(horizontal = JamDimens.paddingSmall, vertical = SUBTITLE_PADDING),
        verticalAlignment = Alignment.CenterVertically
    ) {
        iconName?.let {
            JamIcon(it, colors.muted, size = JamDimens.iconSmall)
            Spacer(modifier = Modifier.width(JamDimens.paddingSmall))
        }
        ThemedText(text, color = colors.muted, fontSize = JamDimens.fontSize, maxLines = 1)
    }
}

private val SUBTITLE_PADDING = 4.dp

data class StatEntry(
    val title: String,
    val value: Int
)

@Composable
fun Stat(
    entry: StatEntry,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current

    Column(
        modifier =
            modifier
                .padding(JamDimens.paddingSmall)
                .clip(RoundedCornerShape(4.dp))
                .background(colors.itemBackground)
                .clickable(onClick = onClick)
                .padding(JamDimens.padding),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        ThemedText(
            entry.value.toString(),
            fontSize = JamDimens.fontSizeLarge,
            fontWeight = FontWeight.Bold
        )
        ThemedText(entry.title, fontSize = JamDimens.fontSizeSmall, maxLines = 1)
    }
}

@Composable
fun GoLeftIcon(onClick: () -> Unit) {
    ClickIcon("left-open", onClick = onClick, size = JamDimens.iconSmall, muted = true)
}

@Composable
fun GoRightIcon(onClick: () -> Unit) {
    ClickIcon("right-open", onClick = onClick, size = JamDimens.iconSmall, muted = true)
}
