package io.github.ffalt.jampacked.ui.browse

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.GoLeftIcon
import io.github.ffalt.jampacked.ui.components.GoRightIcon
import io.github.ffalt.jampacked.ui.components.JamItem
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.ObjectSheetHost
import io.github.ffalt.jampacked.ui.components.PageHeader
import io.github.ffalt.jampacked.ui.components.SelectableTrackItem
import io.github.ffalt.jampacked.ui.components.TrackSelectionOverlay
import io.github.ffalt.jampacked.ui.components.asSheetObject
import io.github.ffalt.jampacked.ui.components.longPress
import io.github.ffalt.jampacked.ui.components.rememberObjectSheet
import io.github.ffalt.jampacked.ui.components.rememberTrackSelection
import io.github.ffalt.jampacked.ui.nav.GenreTab
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.nav.routeForObject

@Composable
fun GenreScreen(
    session: JamSession,
    genreId: String,
    genreName: String,
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: GenreViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val selection = rememberTrackSelection()
    val sheet = rememberObjectSheet()
    val tab = viewModel.tab

    val index = GenreTab.order.indexOf(tab).coerceAtLeast(0)
    val header: @Composable () -> Unit = {
        PageHeader(
            title = genreName,
            subtitle = stringResource(GenreTab.subtitleRes(tab)),
            leading = {
                GenreTab.order.getOrNull(index - 1)?.let { previous ->
                    GoLeftIcon(onClick = { onNavigate(Route.Genre(genreId, genreName, previous)) })
                }
            },
            trailing = {
                GenreTab.order.getOrNull(index + 1)?.let { next ->
                    GoRightIcon(onClick = { onNavigate(Route.Genre(genreId, genreName, next)) })
                }
            }
        )
    }

    Box(modifier = modifier.fillMaxSize()) {
        if (tab == GenreTab.TRACKS) {
            JamList(
                items = state.tracks,
                onReload = { viewModel.load(true) },
                loading = state.loading,
                error = state.error,
                key = { position, track -> "$position-${track.id}" },
                header = header
            ) { _, track ->
                SelectableTrackItem(state = selection, track = track, showTrackNr = false)
            }

            TrackSelectionOverlay(
                state = selection,
                modifier = Modifier.align(Alignment.BottomEnd),
                onOpenTrack = { onNavigate(Route.Track(it.id, it.title)) }
            )
        } else {
            val objType = if (tab == GenreTab.ALBUMS) "album" else "artist"
            JamList(
                items = state.entries,
                onReload = { viewModel.load(true) },
                loading = state.loading,
                error = state.error,
                key = { _, entry -> entry.id },
                header = header
            ) { _, entry ->
                JamItem(
                    session = session,
                    id = entry.id,
                    title = entry.title,
                    description = entry.description,
                    onClick = { routeForObject(objType, entry.id, entry.title)?.let(onNavigate) },
                    onLongClick = sheet.longPress(entry.asSheetObject(objType))
                )
            }

            ObjectSheetHost(state = sheet) { target ->
                routeForObject(target.objType, target.id, target.title)?.let(onNavigate)
            }
        }
    }
}
