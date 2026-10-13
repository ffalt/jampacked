package io.github.ffalt.jampacked.ui.track

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.ErrorView
import io.github.ffalt.jampacked.ui.components.HeaderDetail
import io.github.ffalt.jampacked.ui.components.ObjectHeader
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.player.LyricsView
import io.github.ffalt.jampacked.ui.theme.JamDimens

@Composable
fun TrackScreen(
    session: JamSession,
    trackId: String,
    trackName: String,
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: TrackViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    if (state.error != null) {
        ErrorView(state.error!!, onRetry = { viewModel.load(trackId) }, modifier = modifier)
        return
    }

    Column(modifier = modifier.fillMaxSize()) {
        val track = state.track
        if (track == null) {
            CircularProgressIndicator(modifier = Modifier.padding(JamDimens.padding))
            return@Column
        }

        ObjectHeader(
            session = session,
            id = track.albumID ?: track.id,
            title = track.title.ifEmpty { trackName },
            typeName = "track",
            details =
                listOfNotNull(
                    track.artist.takeIf { it.isNotEmpty() }?.let { artist ->
                        HeaderDetail(
                            "Artist",
                            artist,
                            track.artistID?.let { id -> { onNavigate(Route.Artist(id, artist)) } }
                        )
                    },
                    track.album.takeIf { it.isNotEmpty() }?.let { album ->
                        HeaderDetail(
                            "Album",
                            album,
                            track.albumID?.let { id -> { onNavigate(Route.Album(id, album)) } }
                        )
                    },
                    track.genre?.takeIf { it.isNotEmpty() }?.let { HeaderDetail("Genre", it) }
                ),
            onPlay = viewModel::play,
        )

        LyricsView(lyrics = state.lyrics, loading = state.lyricsLoading)
    }
}
