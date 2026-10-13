package io.github.ffalt.jampacked.ui.browse

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.ui.components.GoLeftIcon
import io.github.ffalt.jampacked.ui.components.GoRightIcon
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.PageHeader
import io.github.ffalt.jampacked.ui.components.SelectableTrackItem
import io.github.ffalt.jampacked.ui.components.TrackSelectionOverlay
import io.github.ffalt.jampacked.ui.components.rememberTrackSelection
import io.github.ffalt.jampacked.ui.nav.Route

@Composable
fun TrackListScreen(
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: TrackListViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val listState = rememberLazyListState()
    val selection = rememberTrackSelection()

    val nearEnd by remember {
        derivedStateOf {
            val last =
                listState.layoutInfo.visibleItemsInfo
                    .lastOrNull()
                    ?.index ?: 0
            val total = listState.layoutInfo.totalItemsCount
            total > 0 && last >= total - 5
        }
    }
    LaunchedEffect(listState) {
        snapshotFlow { nearEnd }.collect { if (it) viewModel.loadMore() }
    }

    Box(modifier = modifier.fillMaxSize()) {
        JamList(
            items = state.tracks,
            onReload = { viewModel.load(true) },
            loading = state.loading,
            error = state.error,
            state = listState,
            key = { index, track -> "$index-${track.id}" },
            header = {
                PageHeader(
                    title = state.title,
                    subtitle =
                        listTypeName(state.listType)
                            ?: state.total.takeIf { it > 0 }?.let { "$it tracks" },
                    leading = {
                        siblingListType(trackListTypes, state.listType, -1)?.let { previous ->
                            GoLeftIcon(onClick = { onNavigate(Route.TrackList(previous)) })
                        }
                    },
                    trailing = {
                        siblingListType(trackListTypes, state.listType, 1)?.let { next ->
                            GoRightIcon(onClick = { onNavigate(Route.TrackList(next)) })
                        }
                    }
                )
            }
        ) { _, track ->
            SelectableTrackItem(state = selection, track = track, showTrackNr = false)
        }

        TrackSelectionOverlay(
            state = selection,
            modifier = Modifier.align(Alignment.BottomEnd),
            onOpenTrack = { onNavigate(Route.Track(it.id, it.title)) }
        )
    }
}
