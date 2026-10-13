package io.github.ffalt.jampacked.ui.browse

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.repo.BrowseEntry
import io.github.ffalt.jampacked.ui.components.GoLeftIcon
import io.github.ffalt.jampacked.ui.components.GoRightIcon
import io.github.ffalt.jampacked.ui.components.IndexGroup
import io.github.ffalt.jampacked.ui.components.IndexList
import io.github.ffalt.jampacked.ui.components.JamItem
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.PageHeader
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
    siblingRoute: ((listType: String?) -> Route)? = null
) {
    val position = if (siblingRoute == null) -1 else browseListTypes.indexOf(state.listType)
    val previous = position > 0
    val next = position >= 0 && position < browseListTypes.lastIndex
    val goTo: (Int) -> Unit = { step ->
        siblingRoute?.let { onNavigate(it(browseListTypes[position + step])) }
    }

    val header: @Composable () -> Unit = {
        PageHeader(
            title = state.title,
            subtitle =
                listTypeName(state.listType)
                    ?: state.total.takeIf { it > 0 }?.let { "$it entries" },
            leading = { if (previous) GoLeftIcon(onClick = { goTo(-1) }) },
            trailing = { if (next) GoRightIcon(onClick = { goTo(1) }) }
        )
    }

    val openEntry: (BrowseEntry) -> Unit = { entry ->
        routeForObject(entry.kind, entry.id, entry.title)?.let(onNavigate)
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
                    onClick = { openEntry(entry) }
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
                onClick = { openEntry(entry) }
            )
        }
    }
}
