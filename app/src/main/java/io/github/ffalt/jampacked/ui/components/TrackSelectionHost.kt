package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.combinedClickable
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.player.PlayerRepository
import javax.inject.Inject

@HiltViewModel
class TrackSelectionViewModel
    @Inject
    constructor(
        private val player: PlayerRepository
    ) : ViewModel() {
        fun playTrack(track: TrackEntry) = player.playTrack(track)

        fun playTracks(tracks: List<TrackEntry>) = player.playTracks(tracks)

        fun addTracksToQueue(tracks: List<TrackEntry>) = player.addTracksToQueue(tracks)
    }

@Composable
fun SelectableTrackItem(
    state: TrackSelectionState,
    track: TrackEntry,
    modifier: Modifier = Modifier,
    showArtist: Boolean = true,
    showTrackNr: Boolean = true,
    isCurrent: Boolean = false,
    viewModel: TrackSelectionViewModel = hiltViewModel()
) {
    TrackItem(
        track = track,
        showCheck = state.showCheck,
        isSelected = state.isSelected(track),
        showArtist = showArtist,
        showTrackNr = showTrackNr,
        isCurrent = isCurrent,
        modifier =
            modifier.combinedClickable(
                onClick = { state.toggle(track) },
                onDoubleClick = {
                    viewModel.playTrack(track)
                    state.clear()
                }
            )
    )
}

@Composable
fun TrackSelectionOverlay(
    state: TrackSelectionState,
    modifier: Modifier = Modifier,
    onOpenTrack: (TrackEntry) -> Unit = {},
    viewModel: TrackSelectionViewModel = hiltViewModel()
) {
    TrackSelectionBar(
        state = state,
        modifier = modifier,
        onAction = { action ->
            val clear =
                runTrackAction(
                    action = action,
                    selection = state.selection,
                    onPlay = viewModel::playTracks,
                    onPlayOne = viewModel::playTrack,
                    onQueue = viewModel::addTracksToQueue,
                    onOpen = onOpenTrack
                )
            if (clear) state.clear()
        }
    )
}
