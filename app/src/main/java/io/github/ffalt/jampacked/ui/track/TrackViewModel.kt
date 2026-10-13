package io.github.ffalt.jampacked.ui.track

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.repo.Lyrics
import io.github.ffalt.jampacked.data.repo.TrackExtrasRepository
import io.github.ffalt.jampacked.data.repo.TrackRepository
import io.github.ffalt.jampacked.player.PlayerRepository
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class TrackUiState(
    val track: TrackEntry? = null,
    val error: String? = null,
    val lyrics: Lyrics? = null,
    val lyricsLoading: Boolean = true
)

@HiltViewModel
class TrackViewModel
    @Inject
    constructor(
        private val repository: TrackRepository,
        private val extras: TrackExtrasRepository,
        private val player: PlayerRepository,
        savedStateHandle: SavedStateHandle
    ) : ViewModel() {
        private val route: Route.Track = savedStateHandle.toRoute<Route.Track>()

        private val uiState = MutableStateFlow(TrackUiState())
        val state: StateFlow<TrackUiState> = uiState.asStateFlow()

        init {
            player.connect()
            load(route.id)
        }

        fun load(id: String) {
            uiState.update { it.copy(lyricsLoading = true) }
            viewModelScope.launch {
                extras
                    .lyrics(id)
                    .onSuccess { lyrics ->
                        uiState.update {
                            it.copy(
                                lyrics = lyrics,
                                lyricsLoading = false
                            )
                        }
                    }.onFailure { uiState.update { it.copy(lyrics = null, lyricsLoading = false) } }
            }
            viewModelScope.launch {
                repository
                    .track(id)
                    .onSuccess { track -> uiState.update { it.copy(track = track, error = null) } }
                    .onFailure { error ->
                        uiState.update { it.copy(error = error.message ?: "Could not load track") }
                    }
            }
        }

        fun play() {
            uiState.value.track?.let { player.playTracks(listOf(it)) }
        }
    }
