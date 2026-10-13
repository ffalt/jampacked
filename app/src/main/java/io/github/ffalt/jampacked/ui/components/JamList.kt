package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier

@Composable
fun <T> JamList(
    items: List<T>?,
    onReload: () -> Unit,
    modifier: Modifier = Modifier,
    loading: Boolean = false,
    error: String? = null,
    key: ((index: Int, item: T) -> Any)? = null,
    state: LazyListState = rememberLazyListState(),
    header: @Composable (() -> Unit)? = null,
    itemContent: @Composable (index: Int, item: T) -> Unit
) {
    if (error != null) {
        ErrorView(message = error, onRetry = onReload, modifier = modifier)
        return
    }

    PullToRefreshBox(
        isRefreshing = loading,
        onRefresh = onReload,
        modifier = modifier.fillMaxSize()
    ) {
        LazyColumn(state = state, modifier = Modifier.fillMaxSize()) {
            header?.let { item { it() } }

            if (items.isNullOrEmpty()) {
                item { ListEmpty(items) }
                return@LazyColumn
            }

            itemsIndexed(
                items = items,
                key = key?.let { extractor -> { index, item -> extractor(index, item) } }
            ) { index, item ->
                if (index == 0) Separator()
                itemContent(index, item)
                if (index < items.lastIndex) Separator()
            }
        }
    }
}
