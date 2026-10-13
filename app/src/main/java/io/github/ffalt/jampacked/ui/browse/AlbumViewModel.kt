package io.github.ffalt.jampacked.ui.browse

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.repo.AlbumDetail
import io.github.ffalt.jampacked.data.repo.AlbumRepository
import io.github.ffalt.jampacked.player.PlayerRepository
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AlbumUiState(
    val loading: Boolean = true,
    val album: AlbumDetail? = null,
    val error: String? = null
)

@HiltViewModel
class AlbumViewModel
    @Inject
    constructor(
        private val repository: AlbumRepository,
        private val player: PlayerRepository,
        savedStateHandle: SavedStateHandle
    ) : ViewModel() {
        private val route: Route.Album = savedStateHandle.toRoute<Route.Album>()

        private val uiState = MutableStateFlow(AlbumUiState())
        val state: StateFlow<AlbumUiState> = uiState.asStateFlow()

        init {
            player.connect()
            load(false)
        }

        fun load(forceRefresh: Boolean) {
            uiState.update { it.copy(loading = true, error = null) }
            viewModelScope.launch {
                repository
                    .album(route.id, forceRefresh)
                    .onSuccess { album -> uiState.update { it.copy(loading = false, album = album) } }
                    .onFailure { error ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                error = error.message ?: "Could not load album"
                            )
                        }
                    }
            }
        }

        fun playAll() {
            uiState.value.album
                ?.tracks
                ?.takeIf { it.isNotEmpty() }
                ?.let(player::playTracks)
        }

        fun playFrom(index: Int) {
            val tracks = uiState.value.album?.tracks ?: return
            if (index !in tracks.indices) return
            player.playTracks(tracks)
            player.skipToTrack(index)
        }
    }
