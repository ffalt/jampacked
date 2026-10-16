package io.github.ffalt.jampacked.ui.browse

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.ErrorView
import io.github.ffalt.jampacked.ui.components.HeaderDetail
import io.github.ffalt.jampacked.ui.components.JamItem
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.LoadingView
import io.github.ffalt.jampacked.ui.components.ObjectHeader
import io.github.ffalt.jampacked.ui.components.SectionHeader
import io.github.ffalt.jampacked.ui.nav.Route

@Composable
fun ArtistScreen(
    session: JamSession,
    artistName: String,
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: ArtistViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    if (state.error != null) {
        ErrorView(state.error!!, onRetry = { viewModel.load(true) }, modifier = modifier)
        return
    }

    Column(modifier = modifier.fillMaxSize()) {
        val artist = state.artist
        if (artist == null) {
            LoadingView(modifier = Modifier.fillMaxSize())
            return@Column
        }

        var sort by rememberSaveable(stateSaver = detailSortSaver) { mutableStateOf(DetailSort()) }
        val sections = detailSections(artist.sections, sort)

        JamList(
            items = browseRows(sections, headings = sort.keepsSections && sections.size > 1),
            onReload = { viewModel.load(true) },
            loading = state.loading,
            key = { index, row -> if (row is BrowseSectionRow.Album) row.entry.id else "h-$index" },
            header = {
                ObjectHeader(
                    session = session,
                    id = artist.id,
                    title = artist.name.ifEmpty { artistName },
                    typeName = stringResource(R.string.artist_detail),
                    details =
                        listOfNotNull(
                            HeaderDetail(stringResource(R.string.albums_detail), artist.albumCount.toString()),
                            HeaderDetail(stringResource(R.string.tracks_detail), artist.trackCount.toString()),
                            artist.genres.firstOrNull()?.let { genre ->
                                HeaderDetail(
                                    stringResource(R.string.genre_detail),
                                    genre,
                                    artist.genreId?.let { id ->
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
                    sheetActions = {
                        DetailSortActions(
                            sections = artist.sections,
                            sort = sort,
                            onChange = { sort = it }
                        )
                    }
                )
            }
        ) { _, row ->
            when (row) {
                is BrowseSectionRow.Heading -> {
                    SectionHeader(albumTypeLabel(row.title))
                }

                is BrowseSectionRow.Album -> {
                    JamItem(
                        session = session,
                        id = row.entry.id,
                        title = row.entry.title,
                        description = row.entry.description,
                        onClick = { onNavigate(Route.Album(row.entry.id, row.entry.title)) }
                    )
                }
            }
        }
    }
}
