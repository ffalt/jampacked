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
fun SeriesScreen(
    session: JamSession,
    seriesName: String,
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: SeriesViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    if (state.error != null) {
        ErrorView(state.error!!, onRetry = { viewModel.load(true) }, modifier = modifier)
        return
    }

    Column(modifier = modifier.fillMaxSize()) {
        val series = state.series
        if (series == null) {
            LoadingView(modifier = Modifier.fillMaxSize())
            return@Column
        }

        var sort by rememberSaveable(stateSaver = detailSortSaver) { mutableStateOf(DetailSort()) }
        val sections = detailSections(series.sections, sort)

        JamList(
            items = browseRows(sections, headings = sort.keepsSections && sections.size > 1),
            onReload = { viewModel.load(true) },
            loading = state.loading,
            key = { index, row -> if (row is BrowseSectionRow.Album) row.entry.id else "h-$index" },
            header = {
                ObjectHeader(
                    session = session,
                    id = series.id,
                    title = series.name.ifEmpty { seriesName },
                    typeName = stringResource(R.string.series),
                    details =
                        listOfNotNull(
                            series.artist?.takeIf { it.isNotEmpty() }?.let { artist ->
                                HeaderDetail(
                                    stringResource(R.string.artist_detail),
                                    artist,
                                    series.artistId?.let { id ->
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
                            HeaderDetail(stringResource(R.string.albums_detail), series.albums.size.toString()),
                            HeaderDetail(stringResource(R.string.tracks_detail), series.trackCount.toString())
                        ),
                    sheetActions = {
                        DetailSortActions(
                            sections = series.sections,
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
