package io.github.ffalt.jampacked.ui.browse

import android.content.Context
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.repo.FolderRepository
import io.github.ffalt.jampacked.player.PlayerRepository
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class TrackListUiState(
    val loading: Boolean = true,
    val error: String? = null,
    val title: String = "",
    val tracks: List<TrackEntry>? = null,
    val total: Int = 0,
    val listType: String? = null,
    val loadingMore: Boolean = false
)

@HiltViewModel
class TrackListViewModel
    @Inject
    constructor(
        private val repository: FolderRepository,
        private val player: PlayerRepository,
        savedStateHandle: SavedStateHandle,
        @ApplicationContext private val context: Context
    ) : ViewModel() {
        private val route: Route.TrackList = savedStateHandle.toRoute<Route.TrackList>()

        private val uiState =
            MutableStateFlow(
                TrackListUiState(title = context.getString(R.string.tracks), listType = route.listType)
            )
        val state: StateFlow<TrackListUiState> = uiState.asStateFlow()

        init {
            player.connect()
            load(false)
        }

        fun load(forceRefresh: Boolean) {
            uiState.update { it.copy(loading = true, error = null) }
            viewModelScope.launch {
                repository
                    .trackList(route.listType, 0, PAGE_SIZE)
                    .onSuccess { (items, total) ->
                        uiState.update { it.copy(loading = false, tracks = items, total = total) }
                    }.onFailure { error ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                error = error.message ?: context.getString(R.string.could_not_load_tracks)
                            )
                        }
                    }
            }
        }

        fun loadMore() {
            val current = uiState.value
            val loaded = current.tracks ?: return
            if (current.loadingMore || loaded.size >= current.total) return
            uiState.update { it.copy(loadingMore = true) }
            viewModelScope.launch {
                repository
                    .trackList(route.listType, loaded.size, PAGE_SIZE)
                    .onSuccess { (items, total) ->
                        uiState.update {
                            it.copy(
                                loadingMore = false,
                                tracks = (it.tracks ?: emptyList()) + items,
                                total = total
                            )
                        }
                    }.onFailure { uiState.update { it.copy(loadingMore = false) } }
            }
        }

        fun playFrom(index: Int) {
            val tracks = uiState.value.tracks ?: return
            if (index !in tracks.indices) return
            player.playTracks(tracks)
            player.skipToTrack(index)
        }

        private companion object {
            const val PAGE_SIZE = 50
        }
    }
