package io.github.ffalt.jampacked.ui.offline

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.ui.components.ClickIcon
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.PageHeader
import io.github.ffalt.jampacked.ui.components.SelectableTrackItem
import io.github.ffalt.jampacked.ui.components.TrackSelectionOverlay
import io.github.ffalt.jampacked.ui.components.rememberTrackSelection
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.theme.JamDimens

@Composable
fun BookmarksScreen(
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: BookmarksViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val selection = rememberTrackSelection()

    Box(modifier = modifier.fillMaxSize()) {
        JamList(
            items = state.tracks,
            onReload = viewModel::load,
            loading = state.loading,
            error = state.error,
            key = { index, track -> "$index-${track.id}" },
            header = {
                PageHeader(
                    title = "Bookmarks",
                    subtitle = if (state.tracks.isNotEmpty()) "${state.tracks.size} entries" else null,
                    trailing = {
                        if (state.tracks.isNotEmpty()) {
                            ClickIcon(
                                "play",
                                onClick = viewModel::playAll,
                                size = JamDimens.iconBig
                            )
                        }
                    }
                )
            }
        ) { _, track ->
            SelectableTrackItem(state = selection, track = track)
        }

        TrackSelectionOverlay(
            state = selection,
            modifier = Modifier.align(Alignment.BottomEnd),
            onOpenTrack = { onNavigate(Route.Track(it.id, it.title)) }
        )
    }
}
