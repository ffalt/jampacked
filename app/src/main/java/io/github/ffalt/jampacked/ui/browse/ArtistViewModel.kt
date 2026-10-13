package io.github.ffalt.jampacked.ui.browse

import android.content.Context
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.repo.ArtistDetail
import io.github.ffalt.jampacked.data.repo.ArtistRepository
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ArtistUiState(
    val loading: Boolean = true,
    val artist: ArtistDetail? = null,
    val error: String? = null
)

@HiltViewModel
class ArtistViewModel
    @Inject
    constructor(
        private val repository: ArtistRepository,
        savedStateHandle: SavedStateHandle,
        @ApplicationContext private val context: Context
    ) : ViewModel() {
        private val route: Route.Artist = savedStateHandle.toRoute<Route.Artist>()

        private val uiState = MutableStateFlow(ArtistUiState())
        val state: StateFlow<ArtistUiState> = uiState.asStateFlow()

        init {
            load(false)
        }

        fun load(forceRefresh: Boolean) {
            uiState.update { it.copy(loading = true, error = null) }
            viewModelScope.launch {
                repository
                    .artist(route.id, forceRefresh)
                    .onSuccess { artist -> uiState.update { it.copy(loading = false, artist = artist) } }
                    .onFailure { error ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                error = error.message ?: context.getString(R.string.could_not_load_artist)
                            )
                        }
                    }
            }
        }
    }
