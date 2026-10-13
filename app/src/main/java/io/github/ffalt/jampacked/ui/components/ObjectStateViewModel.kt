package io.github.ffalt.jampacked.ui.components

import androidx.annotation.OptIn
import androidx.lifecycle.ViewModel
import androidx.media3.common.util.UnstableApi
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.PinRepository
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.state.ObjectStateRepository
import javax.inject.Inject

@HiltViewModel
class ObjectStateViewModel
    @OptIn(UnstableApi::class)
    @Inject
    constructor(
        private val states: ObjectStateRepository,
        private val pins: PinRepository
    ) : ViewModel() {
        suspend fun isFaved(id: String): Boolean = states.isFaved(id).getOrDefault(false)

        suspend fun setFaved(
            id: String,
            faved: Boolean
        ): Boolean? = states.setFaved(id, faved).getOrNull()

        suspend fun rating(id: String): Int = states.rating(id).getOrDefault(0)

        suspend fun setRating(
            id: String,
            rating: Int
        ): Int? = states.setRating(id, rating).getOrNull()

        @OptIn(UnstableApi::class)
        suspend fun isPinned(id: String): Boolean = pins.isPinned(id)

        @OptIn(UnstableApi::class)
        suspend fun togglePin(
            id: String,
            objType: String,
            name: String,
            tracks: List<TrackEntry>
        ): Boolean =
            if (pins.isPinned(id)) {
                pins.unpin(id)
                false
            } else {
                pins.pin(id, objType, name, tracks)
                pins.isPinned(id)
            }
    }
