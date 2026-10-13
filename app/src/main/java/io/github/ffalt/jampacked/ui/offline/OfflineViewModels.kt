package io.github.ffalt.jampacked.ui.offline

import android.content.Context
import androidx.annotation.OptIn
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.media3.common.util.UnstableApi
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.data.DownloadInfo
import io.github.ffalt.jampacked.data.PinMedia
import io.github.ffalt.jampacked.data.PinRepository
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.repo.BookmarkRepository
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.player.PlayerRepository
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject
import kotlin.time.Duration.Companion.milliseconds

data class PinnedMediaUiState(
    val loading: Boolean = true,
    val media: List<PinMedia> = emptyList(),
    val expanded: Set<String> = emptySet(),
    val downloads: Map<String, DownloadInfo> = emptyMap(),
    val files: Int = 0,
    val bytes: Long = 0
)

@HiltViewModel
class PinnedMediaViewModel
    @OptIn(UnstableApi::class)
    @Inject
    constructor(
        private val pins: PinRepository,
        private val player: PlayerRepository
    ) : ViewModel() {
        private val uiState = MutableStateFlow(PinnedMediaUiState())
        val state: StateFlow<PinnedMediaUiState> = uiState.asStateFlow()

        init {
            player.connect()
            load()
            watchDownloads()
        }

        @OptIn(UnstableApi::class)
        fun load() {
            uiState.update { it.copy(loading = true) }
            viewModelScope.launch {
                val media = pins.all()
                val stat = pins.stat()
                uiState.update {
                    it.copy(loading = false, media = media, files = stat.files, bytes = stat.bytes)
                }
                refreshDownloads()
            }
        }

        private fun watchDownloads() {
            viewModelScope.launch {
                while (true) {
                    refreshDownloads()
                    delay(1500.milliseconds)
                }
            }
        }

        @OptIn(UnstableApi::class)
        private fun refreshDownloads() {
            val byId = pins.downloads().associateBy { it.id }
            uiState.update { it.copy(downloads = byId) }
        }

        fun toggle(pinId: String) {
            uiState.update { current ->
                val next = current.expanded.toMutableSet()
                if (!next.add(pinId)) next.remove(pinId)
                current.copy(expanded = next)
            }
        }

        @OptIn(UnstableApi::class)
        fun unpin(pinId: String) {
            viewModelScope.launch {
                pins.unpin(pinId)
                load()
            }
        }

        fun playTracks(tracks: List<TrackEntry>) {
            if (tracks.isNotEmpty()) player.playTracks(tracks)
        }
    }

data class DownloadRow(
    val info: DownloadInfo,
    val track: TrackEntry?
)

data class DownloadsUiState(
    val loading: Boolean = true,
    val downloads: List<DownloadRow> = emptyList(),
    val paused: Boolean = false
)

@HiltViewModel
class DownloadsViewModel
    @OptIn(UnstableApi::class)
    @Inject
    constructor(
        private val pins: PinRepository,
        savedStateHandle: SavedStateHandle
    ) : ViewModel() {
        private val route: Route.Downloads = savedStateHandle.toRoute<Route.Downloads>()

        val active: Boolean = route.active

        private val uiState = MutableStateFlow(DownloadsUiState())
        val state: StateFlow<DownloadsUiState> = uiState.asStateFlow()

        init {
            viewModelScope.launch {
                while (true) {
                    refresh()
                    delay(1500.milliseconds)
                }
            }
        }

        @OptIn(UnstableApi::class)
        fun refresh() {
            viewModelScope.launch {
                val tracks = pins.all().flatMap { it.tracks }.associateBy { it.id }
                val rows =
                    pins
                        .downloads()
                        .filter { !active || it.state in ACTIVEuiStateS }
                        .map { DownloadRow(it, tracks[it.id]) }
                uiState.update {
                    it.copy(loading = false, downloads = rows, paused = pins.downloadsPaused())
                }
            }
        }

        @OptIn(UnstableApi::class)
        fun togglePaused() {
            if (uiState.value.paused) pins.resumeDownloads() else pins.pauseDownloads()
            refresh()
        }

        private companion object {
            val ACTIVEuiStateS = setOf("Downloading", "Queued", "Restarting", "Removing")
        }
    }

data class BookmarksUiState(
    val loading: Boolean = true,
    val tracks: List<TrackEntry> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class BookmarksViewModel
    @Inject
    constructor(
        private val repository: BookmarkRepository,
        private val player: PlayerRepository,
        @ApplicationContext private val context: Context
    ) : ViewModel() {
        private val uiState = MutableStateFlow(BookmarksUiState())
        val state: StateFlow<BookmarksUiState> = uiState.asStateFlow()

        init {
            player.connect()
            load()
        }

        fun load() {
            uiState.update { it.copy(loading = true, error = null) }
            viewModelScope.launch {
                repository
                    .bookmarks()
                    .onSuccess { tracks -> uiState.update { it.copy(loading = false, tracks = tracks) } }
                    .onFailure { e ->
                        uiState.update {
                            it.copy(
                                loading = false,
                                error = e.message ?: context.getString(R.string.could_not_load_bookmarks)
                            )
                        }
                    }
            }
        }

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
    }
