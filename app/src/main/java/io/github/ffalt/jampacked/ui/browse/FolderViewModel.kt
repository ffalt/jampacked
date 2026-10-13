package io.github.ffalt.jampacked.ui.browse

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.repo.FolderDetail
import io.github.ffalt.jampacked.data.repo.FolderRepository
import io.github.ffalt.jampacked.player.PlayerRepository
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class FolderUiState(
    val loading: Boolean = true,
    val folder: FolderDetail? = null,
    val error: String? = null
)

@HiltViewModel
class FolderViewModel
    @Inject
    constructor(
        private val repository: FolderRepository,
        private val player: PlayerRepository,
        savedStateHandle: SavedStateHandle
    ) : ViewModel() {
        private val route: Route.Folder = savedStateHandle.toRoute<Route.Folder>()

        private val uiState = MutableStateFlow(FolderUiState())
        val state: StateFlow<FolderUiState> = uiState.asStateFlow()

        init {
            player.connect()
            load(false)
        }

        fun load(forceRefresh: Boolean) {
            uiState.update { it.copy(loading = true, error = null) }
            viewModelScope.launch {
                repository
                    .folder(route.id, forceRefresh)
                    .onSuccess { folder -> uiState.update { it.copy(loading = false, folder = folder) } }
                    .onFailure { error ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                error = error.message ?: "Could not load folder"
                            )
                        }
                    }
            }
        }

        fun playAll() {
            uiState.value.folder
                ?.tracks
                ?.takeIf { it.isNotEmpty() }
                ?.let(player::playTracks)
        }
    }
