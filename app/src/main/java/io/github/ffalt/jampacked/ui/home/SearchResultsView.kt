package io.github.ffalt.jampacked.ui.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.repo.SearchHit
import io.github.ffalt.jampacked.data.repo.SearchRepository
import io.github.ffalt.jampacked.ui.components.JamImage
import io.github.ffalt.jampacked.ui.components.JamItem
import io.github.ffalt.jampacked.ui.components.ListEmpty
import io.github.ffalt.jampacked.ui.components.SectionHeader
import io.github.ffalt.jampacked.ui.components.Separator
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.nav.routeForObject
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamStyles
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

private val sectionTitles =
    mapOf(
        "artist" to "Artists",
        "album" to "Albums",
        "track" to "Tracks",
        "folder" to "Folders",
        "series" to "Series",
        "playlist" to "Playlists"
    )

@Composable
fun SearchResultsView(
    state: SearchUiState,
    session: JamSession,
    onNavigate: (Route) -> Unit,
    onOpenKind: (String) -> Unit,
    onBackToAll: () -> Unit,
    onLoadMore: () -> Unit,
    modifier: Modifier = Modifier
) {
    val kind = state.kind
    if (kind != null) {
        KindResults(
            kind = kind,
            hits = state.kindHits,
            loading = state.kindLoading,
            session = session,
            onNavigate = onNavigate,
            onBack = onBackToAll,
            onLoadMore = onLoadMore,
            modifier = modifier
        )
        return
    }

    if (state.searching && state.results.isEmpty) {
        CircularProgressIndicator(modifier = modifier)
        return
    }
    if (state.results.isEmpty) {
        ListEmpty(items = emptyList<String>(), modifier = modifier)
        return
    }

    LazyColumn(modifier = modifier.fillMaxSize()) {
        quickSection("artist", state.results.artists, session, onNavigate, onOpenKind)
        quickSection("album", state.results.albums, session, onNavigate, onOpenKind)
        quickSection("track", state.results.tracks, session, onNavigate, onOpenKind)
        quickSection("folder", state.results.folders, session, onNavigate, onOpenKind)
        quickSection("series", state.results.series, session, onNavigate, onOpenKind)
        quickSection("playlist", state.results.playlists, session, onNavigate, onOpenKind)
    }
}

private fun LazyListScope.quickSection(
    kind: String,
    hits: List<SearchHit>,
    session: JamSession,
    onNavigate: (Route) -> Unit,
    onOpenKind: (String) -> Unit
) {
    if (hits.isEmpty()) return
    val title = sectionTitles[kind] ?: kind
    item(key = "header-$kind") {
        SectionHeader(
            title = title,
            modifier = Modifier.clickable { onOpenKind(kind) },
            trailing =
                if (hits.size >= SearchRepository.QUICK_TAKE) {
                    { JamIcon("right-open", LocalJamColors.current.muted) }
                } else {
                    null
                }
        )
    }
    items(hits, key = { "$kind-${it.id}" }) { hit ->

        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .height(JamStyles.itemHeight)
                    .clickable { routeForObject(hit.kind, hit.id, hit.name)?.let(onNavigate) }
                    .padding(horizontal = JamDimens.padding),
            verticalAlignment = Alignment.CenterVertically
        ) {
            JamImage(
                session = session,
                id = hit.id,
                size = JamDimens.thumb,
                modifier = Modifier.padding(end = JamDimens.margin)
            )
            ThemedText(hit.name, maxLines = 2)
        }
        Separator()
    }
}

@Composable
private fun KindResults(
    kind: String,
    hits: List<SearchHit>,
    loading: Boolean,
    session: JamSession,
    onNavigate: (Route) -> Unit,
    onBack: () -> Unit,
    onLoadMore: () -> Unit,
    modifier: Modifier = Modifier
) {
    val listState = rememberLazyListState()
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
        snapshotFlow { nearEnd }.collect { if (it) onLoadMore() }
    }

    Column(modifier = modifier.fillMaxSize()) {
        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .clickable(onClick = onBack)
                    .padding(JamDimens.padding),
            verticalAlignment = Alignment.CenterVertically
        ) {
            JamIcon("left-open", LocalJamColors.current.textColor, size = JamDimens.iconLarge)
            ThemedText(
                text = (sectionTitles[kind] ?: kind),
                fontSize = JamDimens.fontSizeLarge,
                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                modifier = Modifier.padding(start = JamDimens.padding)
            )
        }

        if (hits.isEmpty() && loading) {
            CircularProgressIndicator(modifier = Modifier.padding(JamDimens.padding))
            return@Column
        }

        LazyColumn(state = listState, modifier = Modifier.fillMaxSize()) {
            items(hits, key = { "$kind-${it.id}" }) { hit ->
                JamItem(
                    session = session,
                    id = hit.id,
                    title = hit.name,
                    description = hit.detail,
                    onClick = { routeForObject(hit.kind, hit.id, hit.name)?.let(onNavigate) }
                )
                Separator()
            }
        }
    }
}
