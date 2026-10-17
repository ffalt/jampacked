package io.github.ffalt.jampacked.ui.browse

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.pluralStringResource
import androidx.compose.ui.res.stringResource
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.repo.BrowseEntry
import io.github.ffalt.jampacked.data.repo.BrowseSort
import io.github.ffalt.jampacked.ui.components.GoLeftIcon
import io.github.ffalt.jampacked.ui.components.GoRightIcon
import io.github.ffalt.jampacked.ui.components.IndexGroup
import io.github.ffalt.jampacked.ui.components.IndexList
import io.github.ffalt.jampacked.ui.components.JamItem
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.ObjectSheetHost
import io.github.ffalt.jampacked.ui.components.PageHeader
import io.github.ffalt.jampacked.ui.components.asSheetObject
import io.github.ffalt.jampacked.ui.components.longPress
import io.github.ffalt.jampacked.ui.components.rememberObjectSheet
import io.github.ffalt.jampacked.ui.components.swipeBetweenPages
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.nav.routeForObject

@Composable
fun BrowseListScreen(
    session: JamSession,
    state: BrowseListUiState,
    onReload: () -> Unit,
    onLoadMore: () -> Unit,
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    onSort: (BrowseSort) -> Unit = {},
    siblingRoute: ((listType: String?) -> Route)? = null
) {
    val position = if (siblingRoute == null) -1 else browseListTypes.indexOf(state.listType)
    val previous = position > 0
    val next = position >= 0 && position < browseListTypes.lastIndex
    val goTo: (Int) -> Unit = { step ->
        siblingRoute?.let { onNavigate(it(browseListTypes[position + step])) }
    }

    var sortSheetOpen by rememberSaveable { mutableStateOf(false) }

    val entryCount =
        state.total.takeIf { it > 0 }?.let {
            pluralStringResource(R.plurals.entries_count, it, it)
        }

    val header: @Composable () -> Unit = {
        PageHeader(
            title = state.title,
            subtitle =
                state.sortKind?.let { sortSubtitle(it, state.sort, entryCount) }
                    ?: listTypeName(state.listType)?.let { stringResource(it) }
                    ?: entryCount,
            subtitleIcon = state.sortKind?.let { sortIconName(state.sort) },
            onSubtitleClick = state.sortKind?.let { { sortSheetOpen = true } },
            leading = { if (previous) GoLeftIcon(onClick = { goTo(-1) }) },
            trailing = { if (next) GoRightIcon(onClick = { goTo(1) }) }
        )
    }

    state.sortKind?.takeIf { sortSheetOpen }?.let { kind ->
        BrowseSortSheet(
            kind = kind,
            sort = state.sort,
            onChange = onSort,
            onDismiss = { sortSheetOpen = false }
        )
    }

    val openEntry: (BrowseEntry) -> Unit = { entry ->
        routeForObject(entry.kind, entry.id, entry.title)?.let(onNavigate)
    }

    val sheet = rememberObjectSheet()

    ObjectSheetHost(state = sheet) { target ->
        routeForObject(target.objType, target.id, target.title)?.let(onNavigate)
    }

    Column(
        modifier =
            modifier
                .fillMaxSize()
                .swipeBetweenPages(
                    onPrevious = if (previous) ({ goTo(-1) }) else null,
                    onNext = if (next) ({ goTo(1) }) else null
                )
    ) {
        if (state.groups != null) {
            IndexList(
                groups = state.groups.map { IndexGroup(it.letter, it.items) },
                onReload = onReload,
                loading = state.loading,
                error = state.error,
                header = header
            ) { entry ->
                JamItem(
                    session = session,
                    id = entry.id,
                    title = entry.title,
                    description = entry.description,
                    onClick = { openEntry(entry) },
                    onLongClick = sheet.longPress(entry.asSheetObject())
                )
            }
            return@Column
        }

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

        JamList(
            items = state.items,
            onReload = onReload,
            loading = state.loading,
            error = state.error,
            state = listState,
            key = { _, entry -> entry.id },
            header = header
        ) { _, entry ->
            JamItem(
                session = session,
                id = entry.id,
                title = entry.title,
                description = entry.description,
                onClick = { openEntry(entry) },
                onLongClick = sheet.longPress(entry.asSheetObject())
            )
        }
    }
}
