package io.github.ffalt.jampacked.ui.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
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
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.repo.SearchHit
import io.github.ffalt.jampacked.data.repo.SearchRepository
import io.github.ffalt.jampacked.ui.components.JamImage
import io.github.ffalt.jampacked.ui.components.JamItem
import io.github.ffalt.jampacked.ui.components.ListEmpty
import io.github.ffalt.jampacked.ui.components.LoadingView
import io.github.ffalt.jampacked.ui.components.ObjectSheetHost
import io.github.ffalt.jampacked.ui.components.SectionHeader
import io.github.ffalt.jampacked.ui.components.Separator
import io.github.ffalt.jampacked.ui.components.SheetObject
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.components.longPress
import io.github.ffalt.jampacked.ui.components.rememberObjectSheet
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.nav.routeForObject
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamStyles
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

private val sectionTitles =
    mapOf(
        "artist" to R.string.artists,
        "album" to R.string.albums,
        "track" to R.string.tracks,
        "folder" to R.string.folders,
        "series" to R.string.series,
        "playlist" to R.string.playlists
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
        LoadingView(modifier = modifier)
        return
    }
    if (state.results.isEmpty) {
        ListEmpty(items = emptyList<String>(), modifier = modifier)
        return
    }

    val artistTitle = stringResource(R.string.artists)
    val albumTitle = stringResource(R.string.albums)
    val trackTitle = stringResource(R.string.tracks)
    val folderTitle = stringResource(R.string.folders)
    val seriesTitle = stringResource(R.string.series)
    val playlistTitle = stringResource(R.string.playlists)
    val sheet = rememberObjectSheet()
    val onLongPress: (SearchHit) -> (() -> Unit)? = { hit -> sheet.longPress(hit.asSheetObject()) }

    ObjectSheetHost(state = sheet) { target ->
        routeForObject(target.objType, target.id, target.title)?.let(onNavigate)
    }

    LazyColumn(modifier = modifier.fillMaxSize()) {
        quickSection("artist", artistTitle, state.results.artists, session, onNavigate, onOpenKind, onLongPress)
        quickSection("album", albumTitle, state.results.albums, session, onNavigate, onOpenKind, onLongPress)
        quickSection("track", trackTitle, state.results.tracks, session, onNavigate, onOpenKind, onLongPress)
        quickSection("folder", folderTitle, state.results.folders, session, onNavigate, onOpenKind, onLongPress)
        quickSection("series", seriesTitle, state.results.series, session, onNavigate, onOpenKind, onLongPress)
        quickSection(
            "playlist",
            playlistTitle,
            state.results.playlists,
            session,
            onNavigate,
            onOpenKind,
            onLongPress
        )
    }
}

private fun LazyListScope.quickSection(
    kind: String,
    title: String,
    hits: List<SearchHit>,
    session: JamSession,
    onNavigate: (Route) -> Unit,
    onOpenKind: (String) -> Unit,
    onLongPress: (SearchHit) -> (() -> Unit)?
) {
    if (hits.isEmpty()) return
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
                    .combinedClickable(
                        onClick = { routeForObject(hit.kind, hit.id, hit.name)?.let(onNavigate) },
                        onLongClick = onLongPress(hit)
                    ).padding(horizontal = JamDimens.padding),
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
    val sheet = rememberObjectSheet()
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
                text = sectionTitles[kind]?.let { stringResource(it) } ?: kind,
                fontSize = JamDimens.fontSizeLarge,
                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                modifier = Modifier.padding(start = JamDimens.padding)
            )
        }

        if (hits.isEmpty() && loading) {
            LoadingView(modifier = Modifier.weight(1f))
            return@Column
        }

        ObjectSheetHost(state = sheet) { target ->
            routeForObject(target.objType, target.id, target.title)?.let(onNavigate)
        }

        LazyColumn(state = listState, modifier = Modifier.fillMaxSize()) {
            items(hits, key = { "$kind-${it.id}" }) { hit ->
                JamItem(
                    session = session,
                    id = hit.id,
                    title = hit.name,
                    description = hit.detail,
                    onClick = { routeForObject(hit.kind, hit.id, hit.name)?.let(onNavigate) },
                    onLongClick = sheet.longPress(hit.asSheetObject())
                )
                Separator()
            }
        }
    }
}

private fun SearchHit.asSheetObject(): SheetObject = SheetObject(kind, id, name, detail)
