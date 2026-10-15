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
import io.github.ffalt.jampacked.data.repo.CatalogRepository
import io.github.ffalt.jampacked.data.repo.PlaylistDetail
import io.github.ffalt.jampacked.data.repo.PodcastDetail
import io.github.ffalt.jampacked.data.repo.SeriesDetail
import io.github.ffalt.jampacked.player.PlayerRepository
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SeriesUiState(
    val loading: Boolean = true,
    val series: SeriesDetail? = null,
    val error: String? = null
)

@HiltViewModel
class SeriesViewModel
    @Inject
    constructor(
        private val repository: CatalogRepository,
        savedStateHandle: SavedStateHandle,
        @ApplicationContext private val context: Context
    ) : ViewModel() {
        private val route: Route.Series = savedStateHandle.toRoute<Route.Series>()
        private val uiState = MutableStateFlow(SeriesUiState())
        val state: StateFlow<SeriesUiState> = uiState.asStateFlow()

        init {
            load(false)
        }

        fun load(forceRefresh: Boolean) {
            uiState.update { it.copy(loading = true, error = null) }
            viewModelScope.launch {
                repository
                    .series(route.id, forceRefresh)
                    .onSuccess { series -> uiState.update { it.copy(loading = false, series = series) } }
                    .onFailure { e ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                error = e.message ?: context.getString(R.string.could_not_load)
                            )
                        }
                    }
            }
        }
    }

data class CollectionFact(
    val label: String,
    val value: String
)

data class TrackCollectionUiState(
    val loading: Boolean = true,
    val title: String = "",
    val subtitle: String? = null,
    val facts: List<CollectionFact> = emptyList(),
    val id: String = "",
    val objType: String = "",
    val tracks: List<TrackEntry> = emptyList(),
    val error: String? = null
)

abstract class TrackCollectionViewModel(
    protected val player: PlayerRepository,
    protected val context: Context
) : ViewModel() {
    protected val uiState = MutableStateFlow(TrackCollectionUiState())
    val state: StateFlow<TrackCollectionUiState> = uiState.asStateFlow()

    abstract fun load(forceRefresh: Boolean)

    fun playAll() {
        uiState.value.tracks
            .takeIf { it.isNotEmpty() }
            ?.let(player::playTracks)
    }

    fun playFrom(index: Int) {
        val tracks = uiState.value.tracks
        if (index !in tracks.indices) return
        player.playTracks(tracks)
        player.skipToTrack(index)
    }

    protected fun fail(error: Throwable) {
        uiState.update {
            it.copy(loading = false, error = error.message ?: context.getString(R.string.could_not_load))
        }
    }
}

@HiltViewModel
class PlaylistViewModel
    @Inject
    constructor(
        private val repository: CatalogRepository,
        player: PlayerRepository,
        savedStateHandle: SavedStateHandle,
        @ApplicationContext context: Context
    ) : TrackCollectionViewModel(player, context) {
        private val route: Route.Playlist = savedStateHandle.toRoute<Route.Playlist>()

        init {
            player.connect()
            load(false)
        }

        override fun load(forceRefresh: Boolean) {
            uiState.update { it.copy(loading = true, error = null) }
            viewModelScope.launch {
                repository
                    .playlist(route.id, forceRefresh)
                    .onSuccess { playlist: PlaylistDetail ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                id = playlist.id,
                                objType = "playlist",
                                title = playlist.name,
                                subtitle = playlist.comment,
                                tracks = playlist.tracks
                            )
                        }
                    }.onFailure { fail(it) }
            }
        }
    }

@HiltViewModel
class PodcastViewModel
    @Inject
    constructor(
        private val repository: CatalogRepository,
        player: PlayerRepository,
        savedStateHandle: SavedStateHandle,
        @ApplicationContext context: Context
    ) : TrackCollectionViewModel(player, context) {
        private val route: Route.Podcast = savedStateHandle.toRoute<Route.Podcast>()

        init {
            player.connect()
            load(false)
        }

        override fun load(forceRefresh: Boolean) {
            uiState.update { it.copy(loading = true, error = null) }
            viewModelScope.launch {
                repository
                    .podcast(route.id, forceRefresh)
                    .onSuccess { podcast: PodcastDetail ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                id = podcast.id,
                                objType = "podcast",
                                title = podcast.name,
                                subtitle = podcast.description,
                                facts = podcastFacts(podcast),
                                tracks = podcast.episodes
                            )
                        }
                    }.onFailure { fail(it) }
            }
        }
    }

private fun podcastFacts(podcast: PodcastDetail): List<CollectionFact> =
    buildList {
        podcast.author?.takeIf { it.isNotBlank() }?.let { add(CollectionFact("author", it)) }
        podcast.categories
            .takeIf { it.isNotEmpty() }
            ?.let { add(CollectionFact("categories", it.joinToString())) }
        podcast.language?.takeIf { it.isNotBlank() }?.let { add(CollectionFact("language", it)) }
        if (podcast.episodesCount > 0) add(CollectionFact("episodes", podcast.episodesCount.toString()))
        podcast.lastCheck
            ?.take(ISO_DATE_LENGTH)
            ?.takeIf { it.isNotBlank() && !it.startsWith(NEVER_CHECKED_YEAR) }
            ?.let { add(CollectionFact("last_check", it)) }
        podcast.status?.takeIf { it.isNotBlank() }?.let { add(CollectionFact("status", it)) }
        podcast.errorMessage?.takeIf { it.isNotBlank() }?.let { add(CollectionFact("error", it)) }
    }

private const val ISO_DATE_LENGTH = 10
private const val NEVER_CHECKED_YEAR = "1970"
