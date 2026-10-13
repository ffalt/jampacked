package io.github.ffalt.jampacked.ui.browse

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.repo.AlbumRepository
import io.github.ffalt.jampacked.data.repo.ArtistRepository
import io.github.ffalt.jampacked.data.repo.BrowseEntry
import io.github.ffalt.jampacked.data.repo.FolderRepository
import io.github.ffalt.jampacked.player.PlayerRepository
import io.github.ffalt.jampacked.ui.nav.GenreTab
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class GenreUiState(
    val loading: Boolean = true,
    val error: String? = null,
    val entries: List<BrowseEntry>? = null,
    val tracks: List<TrackEntry>? = null
)

@HiltViewModel
class GenreViewModel
    @Inject
    constructor(
        private val albums: AlbumRepository,
        private val artists: ArtistRepository,
        private val folders: FolderRepository,
        private val player: PlayerRepository,
        savedStateHandle: SavedStateHandle
    ) : ViewModel() {
        private val route: Route.Genre = savedStateHandle.toRoute<Route.Genre>()

        val tab: String = route.tab

        private val uiState = MutableStateFlow(GenreUiState())
        val state: StateFlow<GenreUiState> = uiState.asStateFlow()

        init {
            player.connect()
            load(false)
        }

        fun load(forceRefresh: Boolean) {
            uiState.update { it.copy(loading = true, error = null) }
            viewModelScope.launch {
                when (tab) {
                    GenreTab.ALBUMS -> {
                        albums
                            .list(
                                albumType = null,
                                listType = null,
                                skip = 0,
                                take = PAGE_SIZE,
                                genreId = route.id
                            ).onSuccess { page ->
                                uiState.update {
                                    it.copy(
                                        loading = false,
                                        entries = page.items
                                    )
                                }
                            }.onFailure { e ->
                                uiState.update {
                                    it.copy(
                                        loading = false,
                                        error = e.message
                                    )
                                }
                            }
                    }

                    GenreTab.TRACKS -> {
                        folders
                            .trackList(null, 0, PAGE_SIZE, genreId = route.id)
                            .onSuccess { (items, _) ->
                                uiState.update {
                                    it.copy(
                                        loading = false,
                                        tracks = items
                                    )
                                }
                            }.onFailure { e ->
                                uiState.update {
                                    it.copy(
                                        loading = false,
                                        error = e.message
                                    )
                                }
                            }
                    }

                    else -> {
                        artists
                            .list(
                                listType = null,
                                skip = 0,
                                take = PAGE_SIZE,
                                genreId = route.id,
                                albumType = null
                            ).onSuccess { page ->
                                uiState.update {
                                    it.copy(
                                        loading = false,
                                        entries = page.items
                                    )
                                }
                            }.onFailure { e ->
                                uiState.update {
                                    it.copy(
                                        loading = false,
                                        error = e.message
                                    )
                                }
                            }
                    }
                }
            }
        }

        private companion object {
            const val PAGE_SIZE = 50
        }
    }
