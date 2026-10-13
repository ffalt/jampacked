package io.github.ffalt.jampacked.ui.browse

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.github.ffalt.jampacked.data.repo.BrowseEntry
import io.github.ffalt.jampacked.data.repo.BrowseIndexGroup
import io.github.ffalt.jampacked.data.repo.BrowsePage
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class BrowseListUiState(
    val loading: Boolean = true,
    val error: String? = null,
    val title: String = "",
    val groups: List<BrowseIndexGroup>? = null,
    val items: List<BrowseEntry>? = null,
    val total: Int = 0,
    val listType: String? = null,
    val loadingMore: Boolean = false,
    val hasMore: Boolean = false
)

abstract class BrowseListViewModel : ViewModel() {
    protected val uiState = MutableStateFlow(BrowseListUiState())
    val state: StateFlow<BrowseListUiState> = uiState.asStateFlow()

    protected abstract suspend fun loadIndex(forceRefresh: Boolean): Result<List<BrowseIndexGroup>>

    protected abstract suspend fun loadPage(
        skip: Int,
        take: Int
    ): Result<BrowsePage>

    protected abstract val isIndexMode: Boolean

    fun load(forceRefresh: Boolean = false) {
        uiState.update { it.copy(loading = true, error = null) }
        viewModelScope.launch {
            if (isIndexMode) {
                loadIndex(forceRefresh)
                    .onSuccess { groups ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                groups = groups,
                                total = groups.sumOf { group -> group.items.size }
                            )
                        }
                    }.onFailure { error -> fail(error) }
            } else {
                loadPage(0, PAGE_SIZE)
                    .onSuccess { page ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                items = page.items,
                                total = page.total,
                                hasMore = page.hasMore
                            )
                        }
                    }.onFailure { error -> fail(error) }
            }
        }
    }

    fun loadMore() {
        val current = uiState.value
        if (current.loadingMore || !current.hasMore || current.items == null) return
        uiState.update { it.copy(loadingMore = true) }
        viewModelScope.launch {
            loadPage(current.items.size, PAGE_SIZE)
                .onSuccess { page ->
                    uiState.update {
                        it.copy(
                            loadingMore = false,
                            items = (it.items ?: emptyList()) + page.items,
                            hasMore = page.hasMore
                        )
                    }
                }.onFailure { uiState.update { it.copy(loadingMore = false) } }
        }
    }

    private fun fail(error: Throwable) {
        uiState.update { it.copy(loading = false, error = error.message ?: "Could not load") }
    }

    protected companion object {
        const val PAGE_SIZE = 50
    }
}
