package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamStyles
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import io.github.ffalt.jampacked.util.formatDuration

@Composable
fun ThemedText(
    text: String,
    modifier: Modifier = Modifier,
    color: Color? = null,
    fontSize: TextUnit = JamDimens.fontSize,
    fontWeight: FontWeight? = null,
    maxLines: Int = Int.MAX_VALUE,
    letterSpacing: TextUnit = TextUnit.Unspecified,
    textAlign: TextAlign? = null,
    lineHeight: TextUnit = TextUnit.Unspecified
) {
    Text(
        text = text,
        textAlign = textAlign,
        color = color ?: LocalJamColors.current.textColor,
        fontSize = fontSize,
        fontWeight = fontWeight,
        maxLines = maxLines,
        lineHeight = lineHeight,
        overflow = TextOverflow.Ellipsis,
        letterSpacing = letterSpacing,
        modifier = modifier
    )
}

@Composable
fun Separator(modifier: Modifier = Modifier) {
    Box(
        modifier
            .fillMaxWidth()
            .height(JamStyles.separatorHeight)
            .background(LocalJamColors.current.separator)
    )
}

@Composable
fun LoadingView(modifier: Modifier = Modifier) {
    val colors = LocalJamColors.current
    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        CircularProgressIndicator(color = colors.activeTintColor)
        ThemedText(
            text = stringResource(R.string.loading),
            color = colors.muted,
            letterSpacing = 2.sp,
            modifier = Modifier.padding(top = JamDimens.paddingLarge)
        )
    }
}

@Composable
fun ListEmpty(
    items: List<*>,
    modifier: Modifier = Modifier
) {
    if (items.isNotEmpty()) return
    Column(
        modifier =
            modifier
                .fillMaxWidth()
                .padding(top = 80.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        ThemedText(
            text = stringResource(R.string.no_entries),
            color = LocalJamColors.current.muted,
            letterSpacing = 2.sp
        )
    }
}

@Composable
fun ErrorView(
    message: String,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    Column(
        modifier =
            modifier
                .fillMaxSize()
                .padding(JamDimens.padding),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        JamIcon("warning", colors.warning, size = 48.dp)
        ThemedText(
            text = message,
            color = colors.warning,
            modifier = Modifier.padding(vertical = JamDimens.margin)
        )
        Row(
            modifier =
                Modifier
                    .clip(RoundedCornerShape(4.dp))
                    .clickable(onClick = onRetry)
                    .background(colors.itemBackground)
                    .padding(horizontal = JamDimens.paddingLarge, vertical = JamDimens.padding)
        ) {
            ThemedText(stringResource(R.string.retry), color = colors.activeTintColor)
        }
    }
}

@Composable
fun DurationText(
    durationMs: Long?,
    modifier: Modifier = Modifier,
    fontSize: TextUnit = JamDimens.fontSize,
    color: Color? = null,
    textAlign: TextAlign? = null,
    maxLines: Int = Int.MAX_VALUE
) {
    ThemedText(
        formatDuration(durationMs),
        modifier = modifier,
        fontSize = fontSize,
        color = color,
        textAlign = textAlign,
        maxLines = maxLines
    )
}

@Composable
fun ClickIcon(
    iconName: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: Dp = JamDimens.icon,
    color: Color? = null,
    muted: Boolean = false,
    enabled: Boolean = true
) {
    val colors = LocalJamColors.current
    val tint = color ?: if (muted) colors.muted else colors.textColor
    Box(
        modifier =
            modifier
                .clip(CircleShape)
                .clickable(enabled = enabled, onClick = onClick)
                .padding(JamDimens.paddingSmall),
        contentAlignment = Alignment.Center
    ) {
        JamIcon(iconName, if (enabled) tint else colors.muted, size = size)
    }
}

@Composable
fun ClickLabelIcon(
    iconName: String,
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: Dp = JamDimens.icon,
    color: Color? = null,
    muted: Boolean = false,
    enabled: Boolean = true
) {
    val colors = LocalJamColors.current
    val tint = color ?: if (muted) colors.muted else colors.textColor
    Row(
        modifier =
            modifier
                .clip(RoundedCornerShape(4.dp))
                .clickable(enabled = enabled, onClick = onClick)
                .padding(JamDimens.paddingSmall),
        verticalAlignment = Alignment.CenterVertically
    ) {
        JamIcon(iconName, tint, size = size)
        ThemedText(
            text = label,
            color = tint,
            modifier = Modifier.padding(start = JamDimens.paddingSmall)
        )
    }
}

@Composable
fun ThemedCheckbox(
    checked: Boolean,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    val tint = if (checked) colors.checkboxChecked else colors.checkboxUnchecked
    val shape = RoundedCornerShape(3.dp)
    Box(
        modifier =
            modifier
                .size(20.dp)
                .border(2.dp, tint, shape)
                .clip(shape)
                .background(if (checked) tint else Color.Transparent),
        contentAlignment = Alignment.Center
    ) {
        if (checked) {
            JamIcon("checkmark", colors.background, size = 14.dp)
        }
    }
}

data class RadioEntry(
    val key: String,
    val label: String
)

@Composable
fun CollapsibleSection(
    title: String,
    modifier: Modifier = Modifier,
    initiallyExpanded: Boolean = false,
    content: @Composable () -> Unit
) {
    val colors = LocalJamColors.current
    var expanded by rememberSaveable { mutableStateOf(initiallyExpanded) }

    Column(modifier = modifier.fillMaxWidth()) {
        SectionHeader(
            title = title,
            modifier = Modifier.clickable { expanded = !expanded },
            trailing = {
                JamIcon(
                    name = if (expanded) "up-open" else "down-open",
                    color = colors.muted,
                    size = JamDimens.iconSmall
                )
            }
        )
        if (expanded) content()
    }
}

@Composable
fun SettingToggle(
    label: String,
    checked: Boolean,
    onChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier =
            modifier
                .fillMaxWidth()
                .clickable { onChange(!checked) }
                .padding(horizontal = JamDimens.paddingSmall, vertical = JamDimens.padding),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ThemedText(text = label, modifier = Modifier.weight(1f))
        ThemedCheckbox(checked = checked)
    }
}

@Composable
fun SettingSelect(
    label: String,
    options: List<RadioEntry>,
    value: String?,
    onChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    var picking by remember { mutableStateOf(false) }

    Row(
        modifier =
            modifier
                .fillMaxWidth()
                .clickable { picking = true }
                .padding(horizontal = JamDimens.paddingSmall, vertical = JamDimens.padding),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            ThemedText(label)
            ThemedText(
                text = options.firstOrNull { it.key == value }?.label.orEmpty(),
                color = colors.muted,
                fontSize = JamDimens.fontSizeSmall
            )
        }
        JamIcon("right-open", colors.muted, size = JamDimens.iconSmall)
    }

    if (picking) {
        AlertDialog(
            onDismissRequest = { picking = false },
            containerColor = colors.background,
            title = { ThemedText(label) },
            text = {
                RadioButtons(
                    options = options,
                    value = value,
                    onChange = { key ->
                        onChange(key)
                        picking = false
                    }
                )
            },
            confirmButton = {
                ThemedText(
                    text = stringResource(R.string.cancel),
                    color = colors.activeTintColor,
                    modifier =
                        Modifier
                            .clip(RoundedCornerShape(4.dp))
                            .clickable { picking = false }
                            .padding(JamDimens.padding)
                )
            }
        )
    }
}

@Composable
fun RadioButtons(
    options: List<RadioEntry>,
    value: String?,
    onChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    Column(modifier) {
        options.forEach { entry ->
            Row(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .height(42.dp)
                        .clickable { onChange(entry.key) },
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                ThemedText(entry.label, modifier = Modifier.padding(start = JamDimens.paddingSmall))

                Box(
                    modifier =
                        Modifier
                            .size(20.dp)
                            .border(1.dp, colors.textColor, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    if (value == entry.key) {
                        Box(
                            Modifier
                                .size(14.dp)
                                .clip(CircleShape)
                                .background(colors.navPrimary)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun SectionHeader(
    title: String,
    modifier: Modifier = Modifier,
    trailing: @Composable (() -> Unit)? = null
) {
    Row(
        modifier =
            modifier
                .fillMaxWidth()
                .padding(
                    start = JamDimens.padding,
                    end = JamDimens.padding,
                    top = JamDimens.margin
                ).padding(vertical = JamDimens.paddingLarge),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        ThemedText(
            text = title.uppercase(),
            fontSize = JamStyles.sectionHeaderFontSize,
            fontWeight = FontWeight.Bold,
            letterSpacing = JamStyles.sectionHeaderLetterSpacing
        )
        trailing?.invoke()
    }
}

@Composable
fun ThemedButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier =
            modifier
                .clip(RoundedCornerShape(2.dp))
                .background(BUTTON_BACKGROUND)
                .clickable(onClick = onClick)
                .padding(horizontal = JamDimens.padding, vertical = JamDimens.paddingSmall),
        contentAlignment = Alignment.Center
    ) {
        ThemedText(
            text = label.uppercase(),
            color = Color.White,
            fontSize = JamDimens.fontSizeSmall,
            fontWeight = FontWeight.Medium,
            letterSpacing = 1.sp
        )
    }
}

private val BUTTON_BACKGROUND = Color(0xFF2196F3)
