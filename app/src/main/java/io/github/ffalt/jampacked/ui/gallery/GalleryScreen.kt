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
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import io.github.ffalt.jampacked.R
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

@Composable
fun GalleryScreen(modifier: Modifier = Modifier) {
    val colors = LocalJamColors.current
    val sampleTitle = stringResource(R.string.cloudbusting)
    val sampleArtist = stringResource(R.string.kate_bush)
    val sampleAlbum = stringResource(R.string.hounds_of_love)
    val sampleTrack =
        remember(sampleTitle, sampleArtist, sampleAlbum) {
            TrackEntry(
                id = "t1",
                title = sampleTitle,
                artist = sampleArtist,
                album = sampleAlbum,
                durationMS = 348_000,
                trackNr = "3"
            )
        }
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
        SectionHeader(stringResource(R.string.text_section))
        ThemedText(stringResource(R.string.themed_text_default))
        ThemedText(stringResource(R.string.muted), color = colors.muted, fontSize = JamDimens.fontSizeSmall)
        ThemedText(stringResource(R.string.warning), color = colors.warning)
        ThemedText(stringResource(R.string.active), color = colors.activeTintColor)
        DurationText(durationMs = 348_000)
        DurationText(durationMs = 3_725_000)

        SectionHeader(stringResource(R.string.separator))
        Separator()

        SectionHeader(stringResource(R.string.icons))
        Row(verticalAlignment = Alignment.CenterVertically) {
            ClickIcon("play", onClick = {}, size = JamDimens.iconLarge)
            ClickIcon("pause", onClick = {}, size = JamDimens.iconLarge)
            ClickIcon("heart-full", onClick = {}, size = JamDimens.iconLarge)
            ClickIcon("star-full", onClick = {}, size = JamDimens.iconLarge)
            ClickIcon("trash", onClick = {}, muted = true, size = JamDimens.iconLarge)
            ClickIcon("download", onClick = {}, enabled = false, size = JamDimens.iconLarge)
        }
        ClickLabelIcon("queue", stringResource(R.string.add_to_queue), onClick = {})

        SectionHeader(stringResource(R.string.checkbox))
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(JamDimens.padding)
        ) {
            ThemedCheckbox(checked = checked)
            ThemedCheckbox(checked = !checked)
            ClickLabelIcon("checkmark", stringResource(R.string.toggle), onClick = { checked = !checked })
        }

        SectionHeader(stringResource(R.string.radio_buttons))
        RadioButtons(
            options =
                listOf(
                    RadioEntry("auto", stringResource(R.string.system_theme)),
                    RadioEntry("light", stringResource(R.string.light_theme)),
                    RadioEntry("dark", stringResource(R.string.dark_theme)),
                    RadioEntry("black", stringResource(R.string.black_theme))
                ),
            value = radio,
            onChange = { radio = it }
        )

        SectionHeader(stringResource(R.string.track_items))
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

        SectionHeader(stringResource(R.string.stats))
        Row(horizontalArrangement = Arrangement.spacedBy(JamDimens.paddingSmall)) {
            Stat(StatEntry(stringResource(R.string.artists), 42), onClick = {})
            Stat(StatEntry(stringResource(R.string.albums), 128), onClick = {})
            Stat(StatEntry(stringResource(R.string.tracks), 529), onClick = {})
        }

        SectionHeader(stringResource(R.string.page_header))
        PageHeader(
            title = stringResource(R.string.hounds_of_love),
            subtitle = stringResource(R.string.kate_bush),
            trailing = { ClickIcon("play", onClick = {}, size = JamDimens.iconLarge) }
        )

        SectionHeader(stringResource(R.string.header_details))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            listOf(
                HeaderDetail(stringResource(R.string.tracks_detail), "12"),
                HeaderDetail(stringResource(R.string.genre_detail), stringResource(R.string.art_rock)),
                HeaderDetail(stringResource(R.string.year_detail), "1985")
            ).forEach {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    ThemedText(it.value)
                    ThemedText(it.title, color = colors.muted, fontSize = JamDimens.fontSizeTiny)
                }
            }
        }

        SectionHeader(stringResource(R.string.empty_states))
        ListEmpty(items = null)
        ListEmpty(items = emptyList<String>())

        SectionHeader(stringResource(R.string.error_view))
        ErrorView(message = stringResource(R.string.could_not_reach_server), onRetry = {})
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
