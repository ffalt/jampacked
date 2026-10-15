package io.github.ffalt.jampacked.ui.browse

import android.content.Context
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.EpisodeProgressRepository
import io.github.ffalt.jampacked.data.repo.CatalogRepository
import io.github.ffalt.jampacked.data.repo.EpisodeDetail
import io.github.ffalt.jampacked.player.PlayerRepository
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

const val EPISODE_STATUS_COMPLETED = "completed"
const val EPISODE_STATUS_DOWNLOADING = "downloading"

data class EpisodeUiState(
    val loading: Boolean = true,
    val episode: EpisodeDetail? = null,
    val resumeAtMs: Long = 0,
    val status: String? = null,
    val error: String? = null
) {
    val playable: Boolean get() = status == EPISODE_STATUS_COMPLETED
    val downloading: Boolean get() = status == EPISODE_STATUS_DOWNLOADING
}

@HiltViewModel
class EpisodeViewModel
    @Inject
    constructor(
        private val repository: CatalogRepository,
        private val progress: EpisodeProgressRepository,
        private val player: PlayerRepository,
        savedStateHandle: SavedStateHandle,
        @ApplicationContext private val context: Context
    ) : ViewModel() {
        private val route: Route.Episode = savedStateHandle.toRoute<Route.Episode>()
        private val uiState = MutableStateFlow(EpisodeUiState())
        private var pollJob: Job? = null
        val state: StateFlow<EpisodeUiState> = uiState.asStateFlow()

        init {
            player.connect()
            load(false)
        }

        fun load(forceRefresh: Boolean) {
            viewModelScope.launch {
                uiState.update { it.copy(loading = true, error = null) }
                repository
                    .episode(route.id, forceRefresh)
                    .onSuccess { episode ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                episode = episode,
                                status = episode.status,
                                resumeAtMs = progress.positionOf(episode.id)
                            )
                        }
                        if (uiState.value.downloading) followDownload()
                    }.onFailure { error ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                error = error.message ?: context.getString(R.string.could_not_load)
                            )
                        }
                    }
            }
        }

        fun retrieve() {
            val episode = uiState.value.episode ?: return
            if (uiState.value.downloading) return
            viewModelScope.launch {
                uiState.update { it.copy(status = EPISODE_STATUS_DOWNLOADING, error = null) }
                repository
                    .retrieveEpisode(episode.id)
                    .onSuccess { followDownload() }
                    .onFailure { error ->
                        uiState.update {
                            it.copy(
                                status = episode.status,
                                error = error.message ?: context.getString(R.string.could_not_load)
                            )
                        }
                    }
            }
        }

        private fun followDownload() {
            pollJob?.cancel()
            pollJob =
                viewModelScope.launch {
                    repeat(MAX_STATUS_POLLS) {
                        delay(STATUS_POLL_MS)
                        val status = repository.episodeStatus(route.id).getOrNull() ?: return@launch
                        if (status != EPISODE_STATUS_DOWNLOADING) {
                            uiState.update { it.copy(status = status) }
                            if (status == EPISODE_STATUS_COMPLETED) load(true)
                            return@launch
                        }
                    }
                }
        }

        fun play() {
            uiState.value.episode?.let { player.playTracks(listOf(it.track)) }
        }

        fun playFromStart() {
            val episode = uiState.value.episode ?: return
            viewModelScope.launch {
                progress.forget(episode.id)
                uiState.update { it.copy(resumeAtMs = 0) }
                player.playTracks(listOf(episode.track))
            }
        }
    }

private const val STATUS_POLL_MS = 3_000L
private const val MAX_STATUS_POLLS = 100
