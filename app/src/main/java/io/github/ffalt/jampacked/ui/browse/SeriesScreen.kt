package io.github.ffalt.jampacked.ui.browse

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
import io.github.ffalt.jampacked.ui.components.JamItem
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.ObjectHeader
import io.github.ffalt.jampacked.ui.components.SectionHeader
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.theme.JamDimens

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
            CircularProgressIndicator(modifier = Modifier.padding(JamDimens.padding))
            return@Column
        }

        JamList(
            items = browseRows(series.sections, headings = series.sections.size > 1),
            onReload = { viewModel.load(true) },
            loading = state.loading,
            key = { index, row -> if (row is BrowseSectionRow.Album) row.entry.id else "h-$index" },
            header = {
                ObjectHeader(
                    session = session,
                    id = series.id,
                    title = series.name.ifEmpty { seriesName },
                    typeName = "series",
                    details =
                        listOfNotNull(
                            series.artist?.takeIf { it.isNotEmpty() }?.let { artist ->
                                HeaderDetail(
                                    "Artist",
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
                            HeaderDetail("Albums", series.albums.size.toString()),
                            HeaderDetail("Tracks", series.trackCount.toString())
                        )
                )
            }
        ) { _, row ->
            when (row) {
                is BrowseSectionRow.Heading -> {
                    SectionHeader(row.title)
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
