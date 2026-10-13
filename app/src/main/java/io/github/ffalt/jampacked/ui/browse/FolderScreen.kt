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
import androidx.compose.ui.res.stringResource
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.ErrorView
import io.github.ffalt.jampacked.ui.components.HEADER_SHEET_ROW
import io.github.ffalt.jampacked.ui.components.HeaderDetail
import io.github.ffalt.jampacked.ui.components.JamItem
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.ObjectHeader
import io.github.ffalt.jampacked.ui.components.PinIcon
import io.github.ffalt.jampacked.ui.components.SelectableTrackItem
import io.github.ffalt.jampacked.ui.components.TrackSelectionOverlay
import io.github.ffalt.jampacked.ui.components.rememberTrackSelection
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.theme.JamDimens

@Composable
fun FolderScreen(
    session: JamSession,
    folderName: String,
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: FolderViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val selection = rememberTrackSelection()

    if (state.error != null) {
        ErrorView(state.error!!, onRetry = { viewModel.load(true) }, modifier = modifier)
        return
    }

    Box(modifier = modifier.fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize()) {
            val folder = state.folder
            if (folder == null) {
                CircularProgressIndicator(modifier = Modifier.padding(JamDimens.padding))
                return@Column
            }

            val items: List<Any> = folder.children + folder.tracks

            JamList(
                items = items,
                onReload = { viewModel.load(true) },
                loading = state.loading,
                key = { _, item ->
                    when (item) {
                        is io.github.ffalt.jampacked.data.repo.BrowseEntry -> "f-${item.id}"
                        is io.github.ffalt.jampacked.data.TrackEntry -> "t-${item.id}"
                        else -> item.hashCode()
                    }
                },
                header = {
                    ObjectHeader(
                        session = session,
                        id = folder.id,
                        title = folder.title.ifEmpty { folderName },
                        typeName = folder.folderType ?: stringResource(R.string.folder_type),
                        details =
                            listOfNotNull(
                                folder.artist
                                    ?.takeIf { it.isNotEmpty() }
                                    ?.let { HeaderDetail(stringResource(R.string.artist_detail), it) },
                                folder.folderCount
                                    .takeIf { it > 0 }
                                    ?.let { HeaderDetail(stringResource(R.string.folders_detail), it.toString()) },
                                folder.trackCount
                                    .takeIf { it > 0 }
                                    ?.let { HeaderDetail(stringResource(R.string.tracks_detail), it.toString()) },
                                folder.genres.firstOrNull()?.let {
                                    HeaderDetail(stringResource(R.string.genre_detail), it)
                                }
                            ),
                        onPlay = viewModel::playAll.takeIf { folder.tracks.isNotEmpty() },
                        sheetActions = {
                            if (folder.tracks.isNotEmpty()) {
                                PinIcon(
                                    id = folder.id,
                                    objType = "folder",
                                    name = folder.title,
                                    tracks = folder.tracks,
                                    size = JamDimens.iconLarge,
                                    labeled = true,
                                    modifier = HEADER_SHEET_ROW
                                )
                            }
                        }
                    )
                }
            ) { _, item ->
                when (item) {
                    is io.github.ffalt.jampacked.data.repo.BrowseEntry -> {
                        JamItem(
                            session = session,
                            id = item.id,
                            title = item.title,
                            description = item.description,
                            onClick = { onNavigate(Route.Folder(item.id, item.title)) }
                        )
                    }

                    is io.github.ffalt.jampacked.data.TrackEntry -> {
                        SelectableTrackItem(
                            state = selection,
                            track = item,
                            showArtist = folder.artist.isNullOrEmpty()
                        )
                    }
                }
            }
        }

        TrackSelectionOverlay(
            state = selection,
            modifier = Modifier.align(Alignment.BottomEnd),
            onOpenTrack = { onNavigate(Route.Track(it.id, it.title)) }
        )
    }
}
