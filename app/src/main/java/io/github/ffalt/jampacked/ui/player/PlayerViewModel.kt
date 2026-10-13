package io.github.ffalt.jampacked.ui.player

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.repo.Lyrics
import io.github.ffalt.jampacked.data.repo.TrackExtrasRepository
import io.github.ffalt.jampacked.data.repo.WaveformJson
import io.github.ffalt.jampacked.player.PlayerRepository
import io.github.ffalt.jampacked.player.PlayerState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class PlayerExtras(
    val trackId: String? = null,
    val lyrics: Lyrics? = null,
    val lyricsLoading: Boolean = false,
    val waveform: WaveformJson? = null
)

@HiltViewModel
class PlayerViewModel
    @Inject
    constructor(
        private val player: PlayerRepository,
        private val extrasRepo: TrackExtrasRepository
    ) : ViewModel() {
        val state: StateFlow<PlayerState> = player.state

        private val _extras = MutableStateFlow(PlayerExtras())
        val extras: StateFlow<PlayerExtras> = _extras.asStateFlow()

        init {
            player.connect()
            viewModelScope.launch {
                player.state.collect { playerState ->
                    val id = playerState.current?.id
                    if (id != null && id != _extras.value.trackId) loadExtras(id)
                }
            }
        }

        private fun loadExtras(trackId: String) {
            _extras.update { PlayerExtras(trackId = trackId, lyricsLoading = true) }
            viewModelScope.launch {
                extrasRepo.waveform(trackId).onSuccess { wave ->
                    _extras.update { if (it.trackId == trackId) it.copy(waveform = wave) else it }
                }
            }
            viewModelScope.launch {
                extrasRepo
                    .lyrics(trackId)
                    .onSuccess { lyrics ->
                        _extras.update {
                            if (it.trackId == trackId) {
                                it.copy(
                                    lyrics = lyrics,
                                    lyricsLoading = false
                                )
                            } else {
                                it
                            }
                        }
                    }.onFailure {
                        _extras.update { if (it.trackId == trackId) it.copy(lyricsLoading = false) else it }
                    }
            }
        }

        fun toggle() = player.toggle()

        fun next() = player.skipToNext()

        fun previous() = player.skipToPrevious()

        fun forward() = player.skipForward()

        fun backward() = player.skipBackward()

        fun seekPercent(percent: Float) = player.seekPercent(percent)

        fun skipTo(index: Int) = player.skipToTrack(index)

        fun remove(index: Int) = player.removeFromQueue(index)

        fun move(
            from: Int,
            to: Int
        ) = player.moveInQueue(from, to)

        fun clearQueue() = player.clearQueue()

        fun shuffleQueue() = player.shuffleQueue()

        fun toggleShuffle() = player.toggleShuffle()

        fun cycleRepeat() = player.cycleRepeat()
    }
