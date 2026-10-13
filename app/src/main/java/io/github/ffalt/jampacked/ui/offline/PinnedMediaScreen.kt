package io.github.ffalt.jampacked.ui.offline

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.JamThumb
import io.github.ffalt.jampacked.ui.components.ListEmpty
import io.github.ffalt.jampacked.ui.components.PageHeader
import io.github.ffalt.jampacked.ui.components.PinIcon
import io.github.ffalt.jampacked.ui.components.Separator
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.components.TrackItem
import io.github.ffalt.jampacked.ui.components.swipeBetweenPages
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamStyles
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import java.util.Locale

@Composable
fun PinnedMediaScreen(
    session: JamSession,
    modifier: Modifier = Modifier,
    onNext: () -> Unit = {},
    viewModel: PinnedMediaViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val colors = LocalJamColors.current

    Column(
        modifier =
            modifier
                .fillMaxSize()
                .swipeBetweenPages(onPrevious = null, onNext = onNext)
    ) {
        PageHeader(title = stringResource(R.string.media), subtitle = stringResource(R.string.pinned))

        if (state.media.isEmpty()) {
            ListEmpty(items = if (state.loading) null else emptyList<String>())
            return@Column
        }

        LazyColumn(modifier = Modifier.fillMaxSize()) {
            state.media.forEach { pin ->
                val expanded = pin.id in state.expanded

                item(key = "pin-${pin.id}") {
                    Separator()
                    Row(
                        modifier =
                            Modifier
                                .fillMaxWidth()
                                .background(if (expanded) colors.activeBackgroundColor else Color.Transparent)
                                .clickable { viewModel.toggle(pin.id) }
                                .padding(
                                    horizontal = JamDimens.padding,
                                    vertical = JamDimens.paddingSmall
                                ),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        JamThumb(session = session, id = pin.id)
                        Column(
                            modifier =
                                Modifier
                                    .weight(1f)
                                    .padding(horizontal = JamDimens.margin)
                        ) {
                            ThemedText(pin.name, maxLines = 2)

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                val footer = colors.textColor.copy(alpha = JamStyles.footerAlpha)
                                ThemedText(
                                    text = pin.objType.replaceFirstChar { c -> c.titlecase(Locale.ROOT) },
                                    color = footer,
                                    fontSize = JamDimens.fontSizeSmall
                                )
                                ThemedText(
                                    text = stringResource(R.string.tracks_count_label, pin.tracks.size),
                                    color = footer,
                                    fontSize = JamDimens.fontSizeSmall
                                )
                            }
                        }
                        PinIcon(
                            id = pin.id,
                            objType = pin.objType,
                            name = pin.name,
                            tracks = pin.tracks,
                            size = ITEM_BUTTON_ICON
                        )
                    }
                    Separator()
                }

                if (expanded) {
                    items(
                        pin.tracks.size,
                        key = { i -> "t-${pin.id}-${pin.tracks[i].id}" }
                    ) { index ->
                        val track = pin.tracks[index]
                        val download = state.downloads[track.id]
                        Column {
                            TrackItem(
                                track =
                                    track.copy(
                                        artist = download?.state ?: stringResource(R.string.not_downloaded)
                                    ),
                                onClick = { viewModel.playTracks(pin.tracks.drop(index)) }
                            )
                            Separator()
                        }
                    }
                }
            }
        }
    }
}

private val ITEM_BUTTON_ICON = 22.dp
