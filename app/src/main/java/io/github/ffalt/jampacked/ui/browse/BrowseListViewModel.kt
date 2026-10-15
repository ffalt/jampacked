package io.github.ffalt.jampacked.ui.browse

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.BrowseSortRepository
import io.github.ffalt.jampacked.data.repo.BrowseEntry
import io.github.ffalt.jampacked.data.repo.BrowseIndexGroup
import io.github.ffalt.jampacked.data.repo.BrowsePage
import io.github.ffalt.jampacked.data.repo.BrowseSort
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
    val hasMore: Boolean = false,
    val sortKind: BrowseSortKind? = null,
    val sort: BrowseSort = BrowseSort()
)

data class BrowseSorting(
    val kind: BrowseSortKind,
    val key: String
)

abstract class BrowseListViewModel(
    @ApplicationContext protected val context: Context,
    private val sorts: BrowseSortRepository
) : ViewModel() {
    protected val uiState = MutableStateFlow(BrowseListUiState())
    val state: StateFlow<BrowseListUiState> = uiState.asStateFlow()

    private var sort: BrowseSort = BrowseSort()

    private var sortRestored = false

    /**
     * A filter drops a list that would have shown the A to Z index into the paged query, where the
     * index's own ordering has to be asked for by name or the rows come back in the server's order
     * under a label that says otherwise.
     */
    protected val querySort: BrowseSort
        get() =
            if (hasIndex && sort.orderBy == BrowseSort.DEFAULT_FIELD) {
                sort.copy(orderBy = BrowseSort.NAME_FIELD)
            } else {
                sort
            }

    protected abstract suspend fun loadIndex(forceRefresh: Boolean): Result<List<BrowseIndexGroup>>

    protected abstract suspend fun loadPage(
        skip: Int,
        take: Int
    ): Result<BrowsePage>

    protected abstract val hasIndex: Boolean

    protected open val sorting: BrowseSorting? = null

    fun load(forceRefresh: Boolean = false) {
        uiState.update { it.copy(loading = true, error = null) }
        viewModelScope.launch {
            restoreSort()
            if (hasIndex && sort.isDefault) {
                loadIndex(forceRefresh)
                    .onSuccess { groups ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                groups = groups,
                                items = null,
                                hasMore = false,
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
                                groups = null,
                                items = page.items,
                                total = page.total,
                                hasMore = page.hasMore
                            )
                        }
                    }.onFailure { error -> fail(error) }
            }
        }
    }

    fun setSort(value: BrowseSort) {
        sort = value
        val toIndex = hasIndex && value.isDefault
        uiState.update {
            it.copy(
                sort = value,
                groups = it.groups.takeIf { _ -> toIndex },
                items = it.items.takeIf { _ -> !toIndex },
                hasMore = false
            )
        }
        val key = sorting?.key
        if (key != null) viewModelScope.launch { sorts.save(key, value) }
        load()
    }

    private suspend fun restoreSort() {
        if (sortRestored) return
        sortRestored = true
        val sorting = sorting ?: return
        sort = sorts.load(sorting.key)
        uiState.update { it.copy(sortKind = sorting.kind, sort = sort) }
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
        uiState.update {
            it.copy(loading = false, error = error.message ?: context.getString(R.string.could_not_load))
        }
    }

    protected companion object {
        const val PAGE_SIZE = 50
    }
}
