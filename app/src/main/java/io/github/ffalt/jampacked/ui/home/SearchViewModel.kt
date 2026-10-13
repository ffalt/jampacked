package io.github.ffalt.jampacked.ui.home

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.repo.SearchHit
import io.github.ffalt.jampacked.data.repo.SearchRepository
import io.github.ffalt.jampacked.data.repo.SearchResults
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject
import kotlin.time.Duration.Companion.milliseconds

data class SearchUiState(
    val query: String = "",
    val searching: Boolean = false,
    val results: SearchResults = SearchResults(),
    val error: String? = null,
    val kind: String? = null,
    val kindHits: List<SearchHit> = emptyList(),
    val kindTotal: Int = 0,
    val kindLoading: Boolean = false
) {
    val active: Boolean get() = query.isNotBlank()
}

@OptIn(FlowPreview::class)
@HiltViewModel
class SearchViewModel
    @Inject
    constructor(
        private val repository: SearchRepository,
        @ApplicationContext private val context: Context
    ) : ViewModel() {
        private val uiState = MutableStateFlow(SearchUiState())
        val state: StateFlow<SearchUiState> = uiState.asStateFlow()

        private val queries = MutableStateFlow("")

        init {
            viewModelScope.launch {

                queries.debounce(DEBOUNCE_MS.milliseconds).distinctUntilChanged().collect { query ->
                    if (query.isBlank()) {
                        uiState.update {
                            it.copy(
                                searching = false,
                                results = SearchResults(),
                                error = null
                            )
                        }
                        return@collect
                    }
                    uiState.update { it.copy(searching = true, error = null) }
                    repository
                        .search(query)
                        .onSuccess { results ->
                            uiState.update { it.copy(searching = false, results = results) }
                        }.onFailure { error ->
                            uiState.update {
                                it.copy(
                                    searching = false,
                                    error = error.message ?: context.getString(R.string.search_failed)
                                )
                            }
                        }
                }
            }
        }

        fun onQuery(value: String) {
            uiState.update { it.copy(query = value, kind = null, kindHits = emptyList(), kindTotal = 0) }
            queries.value = value
        }

        fun clear() = onQuery("")

        fun openKind(kind: String) {
            uiState.update { it.copy(kind = kind, kindHits = emptyList(), kindTotal = 0) }
            loadKind(reset = true)
        }

        fun backToAll() {
            uiState.update { it.copy(kind = null, kindHits = emptyList(), kindTotal = 0) }
        }

        fun loadMoreKind() {
            val current = uiState.value
            if (current.kindLoading || current.kindHits.size >= current.kindTotal) return
            loadKind(reset = false)
        }

        private fun loadKind(reset: Boolean) {
            val current = uiState.value
            val kind = current.kind ?: return
            uiState.update { it.copy(kindLoading = true, error = null) }
            viewModelScope.launch {
                val skip = if (reset) 0 else current.kindHits.size
                repository
                    .searchKind(current.query, kind, SearchRepository.PAGE_TAKE, skip)
                    .onSuccess { page ->
                        uiState.update {
                            it.copy(
                                kindLoading = false,
                                kindHits = if (reset) page.hits else it.kindHits + page.hits,
                                kindTotal = page.total
                            )
                        }
                    }.onFailure { error ->
                        uiState.update {
                            it.copy(
                                kindLoading = false,
                                error = error.message ?: context.getString(R.string.search_failed)
                            )
                        }
                    }
            }
        }

        private companion object {
            const val DEBOUNCE_MS = 300L
        }
    }
