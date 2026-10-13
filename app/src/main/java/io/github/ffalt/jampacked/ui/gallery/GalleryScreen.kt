package io.github.ffalt.jampacked.ui.gallery

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.ui.components.ClickIcon
import io.github.ffalt.jampacked.ui.components.ClickLabelIcon
import io.github.ffalt.jampacked.ui.components.DurationText
import io.github.ffalt.jampacked.ui.components.ErrorView
import io.github.ffalt.jampacked.ui.components.HeaderDetail
import io.github.ffalt.jampacked.ui.components.ListEmpty
import io.github.ffalt.jampacked.ui.components.PageHeader
import io.github.ffalt.jampacked.ui.components.RadioButtons
import io.github.ffalt.jampacked.ui.components.RadioEntry
import io.github.ffalt.jampacked.ui.components.SectionHeader
import io.github.ffalt.jampacked.ui.components.Separator
import io.github.ffalt.jampacked.ui.components.Stat
import io.github.ffalt.jampacked.ui.components.StatEntry
import io.github.ffalt.jampacked.ui.components.ThemedCheckbox
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.components.TrackItem
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamTheme
import io.github.ffalt.jampacked.ui.theme.JamThemeName
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

private val sampleTrack =
    TrackEntry(
        id = "t1",
        title = "Cloudbusting",
        artist = "Kate Bush",
        album = "Hounds Of Love",
        durationMS = 348_000,
        trackNr = "3"
    )

@Composable
fun GalleryScreen(modifier: Modifier = Modifier) {
    val colors = LocalJamColors.current
    var checked by remember { mutableStateOf(true) }
    var radio by remember { mutableStateOf("dark") }
    var selected by remember { mutableStateOf(false) }

    Column(
        modifier =
            modifier
                .fillMaxSize()
                .background(colors.background)
                .verticalScroll(rememberScrollState())
                .padding(JamDimens.padding)
    ) {
        SectionHeader("Text")
        ThemedText("ThemedText default")
        ThemedText("muted", color = colors.muted, fontSize = JamDimens.fontSizeSmall)
        ThemedText("warning", color = colors.warning)
        ThemedText("active", color = colors.activeTintColor)
        DurationText(durationMs = 348_000)
        DurationText(durationMs = 3_725_000)

        SectionHeader("Separator")
        Separator()

        SectionHeader("Icons")
        Row(verticalAlignment = Alignment.CenterVertically) {
            ClickIcon("play", onClick = {}, size = JamDimens.iconLarge)
            ClickIcon("pause", onClick = {}, size = JamDimens.iconLarge)
            ClickIcon("heart-full", onClick = {}, size = JamDimens.iconLarge)
            ClickIcon("star-full", onClick = {}, size = JamDimens.iconLarge)
            ClickIcon("trash", onClick = {}, muted = true, size = JamDimens.iconLarge)
            ClickIcon("download", onClick = {}, enabled = false, size = JamDimens.iconLarge)
        }
        ClickLabelIcon("queue", "Add to queue", onClick = {})

        SectionHeader("Checkbox")
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(JamDimens.padding)
        ) {
            ThemedCheckbox(checked = checked)
            ThemedCheckbox(checked = !checked)
            ClickLabelIcon("checkmark", "toggle", onClick = { checked = !checked })
        }

        SectionHeader("Radio buttons")
        RadioButtons(
            options =
                listOf(
                    RadioEntry("auto", "System Theme"),
                    RadioEntry("light", "Light"),
                    RadioEntry("dark", "Dark"),
                    RadioEntry("black", "Black")
                ),
            value = radio,
            onChange = { radio = it }
        )

        SectionHeader("Track items")
        TrackItem(track = sampleTrack, onClick = {})
        Separator()
        TrackItem(track = sampleTrack, isCurrent = true, onClick = {})
        Separator()
        TrackItem(
            track = sampleTrack,
            showCheck = true,
            isSelected = selected,
            onClick = { selected = !selected }
        )

        SectionHeader("Stats")
        Row(horizontalArrangement = Arrangement.spacedBy(JamDimens.paddingSmall)) {
            Stat(StatEntry("Artists", 42), onClick = {})
            Stat(StatEntry("Albums", 128), onClick = {})
            Stat(StatEntry("Tracks", 529), onClick = {})
        }

        SectionHeader("Page header")
        PageHeader(
            title = "Hounds Of Love",
            subtitle = "Kate Bush",
            trailing = { ClickIcon("play", onClick = {}, size = JamDimens.iconLarge) }
        )

        SectionHeader("Header details")
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            listOf(
                HeaderDetail("Tracks", "12"),
                HeaderDetail("Genre", "Art Rock"),
                HeaderDetail("Year", "1985")
            ).forEach {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    ThemedText(it.value)
                    ThemedText(it.title, color = colors.muted, fontSize = JamDimens.fontSizeTiny)
                }
            }
        }

        SectionHeader("Empty states")
        ListEmpty(items = null)
        ListEmpty(items = emptyList<String>())

        SectionHeader("Error view")
        ErrorView(message = "Could not reach server", onRetry = {})
    }
}

@Preview(name = "Light", heightDp = 1800)
@Composable
private fun GalleryLight() {
    JamTheme(themeName = JamThemeName.LIGHT) { GalleryScreen() }
}

@Preview(name = "Dark", heightDp = 1800)
@Composable
private fun GalleryDark() {
    JamTheme(themeName = JamThemeName.DARK) { GalleryScreen() }
}

@Preview(name = "Black", heightDp = 1800)
@Composable
private fun GalleryBlack() {
    JamTheme(themeName = JamThemeName.BLACK) { GalleryScreen() }
}
