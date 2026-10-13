package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import kotlinx.coroutines.launch

data class IndexGroup<T>(
    val letter: String,
    val items: List<T>
)

@Composable
fun <T> IndexList(
    groups: List<IndexGroup<T>>?,
    onReload: () -> Unit,
    modifier: Modifier = Modifier,
    loading: Boolean = false,
    error: String? = null,
    header: @Composable (() -> Unit)? = null,
    itemContent: @Composable (T) -> Unit
) {
    if (error != null) {
        ErrorView(message = error, onRetry = onReload, modifier = modifier)
        return
    }

    val state = rememberLazyListState()
    val scope = rememberCoroutineScope()
    var activeLetter by remember { mutableStateOf<String?>(null) }

    val headerPositions =
        remember(groups, header) {
            buildMap {
                var position = if (header != null) 1 else 0
                groups?.forEach { group ->
                    put(group.letter, position)
                    position += group.items.size
                }
            }
        }

    Box(modifier = modifier.fillMaxSize()) {
        PullToRefreshBox(isRefreshing = loading, onRefresh = onReload) {
            LazyColumn(state = state, modifier = Modifier.fillMaxSize()) {
                header?.let { item { it() } }

                if (groups.isNullOrEmpty()) {
                    item { ListEmpty(groups) }
                    return@LazyColumn
                }

                val firstLetter = groups.first().letter
                val lastLetter = groups.last().letter
                groups.forEach { group ->
                    val firstGroup = group.letter == firstLetter
                    val lastGroup = group.letter == lastLetter
                    itemsIndexed(
                        group.items,
                        key = { _, item -> "${group.letter}-${item.hashCode()}" }
                    ) { index, item ->
                        if (firstGroup && index == 0) Separator()
                        itemContent(item)
                        if (!lastGroup || index < group.items.lastIndex) Separator()
                    }
                }
            }
        }

        if (!groups.isNullOrEmpty()) {
            AtoZPicker(
                letters = groups.map { it.letter },
                activeLetter = activeLetter,
                onLetter = { letter ->
                    activeLetter = letter
                    headerPositions[letter]?.let { position ->
                        scope.launch { state.scrollToItem(position) }
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
        }
    }
}
