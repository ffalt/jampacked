package io.github.ffalt.jampacked.ui.browse

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.ErrorView
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.ObjectHeader
import io.github.ffalt.jampacked.ui.components.ObjectHeaderPanel
import io.github.ffalt.jampacked.ui.components.SelectableTrackItem
import io.github.ffalt.jampacked.ui.components.TrackSelectionOverlay
import io.github.ffalt.jampacked.ui.components.rememberTrackSelection
import io.github.ffalt.jampacked.ui.nav.Route

@Composable
fun TrackCollectionScreen(
    session: JamSession,
    state: TrackCollectionUiState,
    fallbackTitle: String,
    onReload: () -> Unit,
    onPlayAll: () -> Unit,
    onNavigate: (Route) -> Unit,
    showArtist: Boolean,
    modifier: Modifier = Modifier
) {
    val selection = rememberTrackSelection()

    if (state.error != null) {
        ErrorView(state.error, onRetry = onReload, modifier = modifier)
        return
    }

    Column(modifier = modifier.fillMaxSize()) {
        Box(modifier = Modifier.weight(1f)) {
            JamList(
                items = state.tracks,
                onReload = onReload,
                loading = state.loading,
                key = { index, track -> "$index-${track.id}" },
                header = {
                    ObjectHeader(
                        session = session,
                        id = state.id,
                        title = state.title.ifEmpty { fallbackTitle },
                        typeName = state.objType,
                        customDetails = { ObjectHeaderPanel(state.subtitle.orEmpty()) },
                        onPlay = onPlayAll.takeIf { state.tracks.isNotEmpty() },
                    )
                }
            ) { _, track ->
                SelectableTrackItem(state = selection, track = track, showArtist = showArtist)
            }

            TrackSelectionOverlay(
                state = selection,
                modifier = Modifier.align(Alignment.BottomEnd),
                onOpenTrack = { onNavigate(Route.Track(it.id, it.title)) }
            )
        }
    }
}
