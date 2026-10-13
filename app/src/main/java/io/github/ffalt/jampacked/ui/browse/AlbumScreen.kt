package io.github.ffalt.jampacked.ui.browse

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.ErrorView
import io.github.ffalt.jampacked.ui.components.HEADER_SHEET_ROW
import io.github.ffalt.jampacked.ui.components.HeaderDetail
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.ObjectHeader
import io.github.ffalt.jampacked.ui.components.PinIcon
import io.github.ffalt.jampacked.ui.components.SelectableTrackItem
import io.github.ffalt.jampacked.ui.components.TrackSelectionOverlay
import io.github.ffalt.jampacked.ui.components.rememberTrackSelection
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.theme.JamDimens

@Composable
fun AlbumScreen(
    session: JamSession,
    albumName: String,
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: AlbumViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val selection = rememberTrackSelection()

    if (state.error != null) {
        ErrorView(state.error!!, onRetry = { viewModel.load(true) }, modifier = modifier)
        return
    }

    Box(modifier = modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize()) {
            val album = state.album
            if (album == null) {
                CircularProgressIndicator(modifier = Modifier.padding(JamDimens.padding))
                return@Column
            }

            JamList(
                items = album.tracks,
                onReload = { viewModel.load(true) },
                loading = state.loading,
                key = { _, track -> track.id },
                header = {
                    ObjectHeader(
                        session = session,
                        id = album.id,
                        title = album.name.ifEmpty { albumName },
                        typeName = album.albumType ?: "album",
                        details =
                            listOfNotNull(
                                album.artist.takeIf { it.isNotEmpty() }?.let { artist ->
                                    HeaderDetail(
                                        "Artist",
                                        artist,
                                        album.artistId?.let { id ->
                                            {
                                                onNavigate(
                                                    Route.Artist(
                                                        id,
                                                        artist
                                                    )
                                                )
                                            }
                                        }
                                    )
                                },
                                HeaderDetail("Tracks", album.trackCount.toString()),
                                album.genres.firstOrNull()?.let { genre ->
                                    HeaderDetail(
                                        "Genre",
                                        genre,
                                        album.genreId?.let { id ->
                                            {
                                                onNavigate(
                                                    Route.Genre(
                                                        id,
                                                        genre
                                                    )
                                                )
                                            }
                                        }
                                    )
                                }
                            ),
                        onPlay = viewModel::playAll,
                        sheetActions = {
                            PinIcon(
                                id = album.id,
                                objType = "album",
                                name = album.name,
                                tracks = album.tracks,
                                size = JamDimens.iconLarge,
                                labeled = true,
                                modifier = HEADER_SHEET_ROW
                            )
                        }
                    )
                }
            ) { _, track ->
                SelectableTrackItem(
                    state = selection,
                    track = track,
                    showArtist = album.artist.isEmpty()
                )
            }
        }

        TrackSelectionOverlay(
            state = selection,
            modifier = Modifier.align(Alignment.BottomEnd),
            onOpenTrack = { onNavigate(Route.Track(it.id, it.title)) }
        )
    }
}
