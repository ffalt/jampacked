package io.github.ffalt.jampacked.ui.components

import androidx.annotation.StringRes
import androidx.compose.foundation.background
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.res.pluralStringResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import io.github.ffalt.jampacked.util.formatDuration
import kotlinx.coroutines.delay
import kotlin.time.Duration.Companion.milliseconds

data class SelectionAction(
    val name: String,
    val icon: String,
    @StringRes val labelRes: Int
)

private val multiSelectActions =
    listOf(
        SelectionAction("bt_m_play", "play", R.string.play_selected_tracks),
        SelectionAction("bt_m_queue", "list-add", R.string.add_selected_tracks_to_queue),
        SelectionAction("bt_clear", "minus", R.string.clear_selection)
    )

private val singleSelectActions =
    listOf(
        SelectionAction("bt_s_play", "play", R.string.play_track),
        SelectionAction("bt_s_queue", "list-add", R.string.add_selected_tracks_to_queue),
        SelectionAction("bt_s_open", "track", R.string.open_track_details)
    )

class TrackSelectionState {
    var selection by mutableStateOf<List<TrackEntry>>(emptyList())
        private set

    var tooltip by mutableStateOf<Int?>(null)
        internal set

    var sheetTrack by mutableStateOf<TrackEntry?>(null)
        private set

    internal var tooltipToken by mutableIntStateOf(0)

    val showCheck: Boolean get() = selection.isNotEmpty()

    val actions: List<SelectionAction>
        get() =
            when {
                selection.isEmpty() -> emptyList()
                selection.size == 1 -> singleSelectActions
                else -> multiSelectActions
            }

    val summaryDuration: Long get() = selection.sumOf { it.durationMS }

    fun isSelected(track: TrackEntry): Boolean = selection.any { it.id == track.id }

    fun toggle(track: TrackEntry) {
        selection =
            if (isSelected(track)) {
                selection.filterNot { it.id == track.id }
            } else {
                selection + track
            }
    }

    fun clear() {
        selection = emptyList()
    }

    fun showSheet(track: TrackEntry) {
        sheetTrack = track
    }

    fun hideSheet() {
        sheetTrack = null
    }

    fun showTooltip(
        @StringRes labelRes: Int
    ) {
        tooltip = labelRes
        tooltipToken++
    }
}

@Composable
fun rememberTrackSelection(): TrackSelectionState {
    val state = remember { TrackSelectionState() }

    LaunchedEffect(state.tooltipToken) {
        if (state.tooltipToken > 0) {
            delay(TOOLTIP_MS.milliseconds)
            state.tooltip = null
        }
    }
    return state
}

@Composable
fun TrackSelectionBar(
    state: TrackSelectionState,
    onAction: (SelectionAction) -> Unit,
    modifier: Modifier = Modifier
) {
    if (state.selection.isEmpty()) return
    val summary =
        pluralStringResource(
            R.plurals.selection_summary,
            state.selection.size,
            state.selection.size,
            formatDuration(state.summaryDuration)
        )
    val colors = LocalJamColors.current

    Column(
        modifier = modifier.padding(end = JamDimens.padding, bottom = JamDimens.paddingLarge),
        horizontalAlignment = Alignment.End,
        verticalArrangement = Arrangement.spacedBy(JamDimens.paddingSmall)
    ) {
        Box(
            modifier =
                Modifier
                    .shadow(ELEVATION, RoundedCornerShape(20.dp))
                    .clip(RoundedCornerShape(20.dp))
                    .background(colors.floatingBackground)
                    .padding(horizontal = JamDimens.paddingLarge, vertical = JamDimens.padding)
        ) {
            ThemedText(
                text = summary,
                color = colors.floatingColor,
                fontWeight = FontWeight.Medium
            )
        }

        state.tooltip?.let { labelRes ->
            Box(
                modifier =
                    Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(colors.floatingBackground)
                        .padding(horizontal = JamDimens.padding, vertical = JamDimens.paddingSmall)
            ) {
                ThemedText(
                    text = stringResource(labelRes),
                    color = colors.floatingColor,
                    fontSize = JamDimens.fontSizeSmall
                )
            }
        }

        Row(
            modifier =
                Modifier
                    .shadow(ELEVATION, RoundedCornerShape(25.dp))
                    .clip(RoundedCornerShape(25.dp))
                    .background(colors.floatingBackground)
        ) {
            state.actions.forEach { action ->
                Box(
                    modifier =
                        Modifier
                            .widthIn(min = 56.dp)
                            .combinedClickable(
                                onClick = { onAction(action) },
                                onLongClick = { state.showTooltip(action.labelRes) }
                            ).padding(
                                horizontal = JamDimens.paddingLarge + 5.dp,
                                vertical = JamDimens.paddingLarge
                            ),
                    contentAlignment = Alignment.Center
                ) {
                    JamIcon(action.icon, colors.floatingColor, size = 26.dp)
                }
            }
        }
    }
}

fun runTrackAction(
    action: SelectionAction,
    selection: List<TrackEntry>,
    onPlay: (List<TrackEntry>) -> Unit,
    onPlayOne: (TrackEntry) -> Unit,
    onQueue: (List<TrackEntry>) -> Unit,
    onOpen: (TrackEntry) -> Unit
): Boolean =
    selection.isNotEmpty() &&
        when (action.name) {
            "bt_clear" -> {
                true
            }

            "bt_m_play" -> {
                onPlay(selection)
                true
            }

            "bt_m_queue" -> {
                onQueue(selection)
                true
            }

            "bt_s_play" -> {
                onPlayOne(selection.first())
                true
            }

            "bt_s_queue" -> {
                onQueue(listOf(selection.first()))
                true
            }

            "bt_s_open" -> {
                onOpen(selection.first())
                false
            }

            else -> {
                false
            }
        }

private const val TOOLTIP_MS = 1500L

private val ELEVATION = 4.dp
