package io.github.ffalt.jampacked.ui.components

import androidx.annotation.StringRes
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.ViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.repo.AlbumRepository
import io.github.ffalt.jampacked.data.repo.BrowseEntry
import io.github.ffalt.jampacked.data.repo.CatalogRepository
import io.github.ffalt.jampacked.data.repo.FolderRepository
import io.github.ffalt.jampacked.data.repo.TrackRepository
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import javax.inject.Inject

/** The row a long press opened the sheet for. */
data class SheetObject(
    val objType: String,
    val id: String,
    val title: String,
    val subtitle: String = ""
)

fun BrowseEntry.asSheetObject(objType: String = kind): SheetObject =
    SheetObject(objType = objType, id = id, title = title, subtitle = description)

class ObjectSheetState {
    var target by mutableStateOf<SheetObject?>(null)
        private set

    fun show(target: SheetObject) {
        this.target = target
    }

    fun hide() {
        target = null
    }
}

@Composable
fun rememberObjectSheet(): ObjectSheetState = remember { ObjectSheetState() }

/**
 * The long press handler for a row, or null for a kind the sheet has nothing to say about - a
 * genre carries no state of its own, and the row already walks to it.
 */
fun ObjectSheetState.longPress(target: SheetObject): (() -> Unit)? =
    if (objectKinds.containsKey(target.objType)) ({ show(target) }) else null

/**
 * Renders the sheet of whichever row is currently long pressed. Navigation stays with the screen,
 * which knows what its rows point at.
 */
@Composable
fun ObjectSheetHost(
    state: ObjectSheetState,
    onOpen: (SheetObject) -> Unit
) {
    val target = state.target ?: return
    val kind = objectKinds[target.objType] ?: return

    EntrySheet(
        target = target,
        kind = kind,
        onOpen = {
            state.hide()
            onOpen(target)
        },
        onDismiss = state::hide
    )
}

/**
 * The long press sheet of a list row: what the object header keeps behind its overflow, plus
 * whatever only the row can offer - pinning it and walking to its own screen.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ObjectSheet(
    id: String,
    title: String,
    subtitle: String,
    onDismiss: () -> Unit,
    actions: @Composable () -> Unit
) {
    val colors = LocalJamColors.current

    ModalBottomSheet(onDismissRequest = onDismiss, containerColor = colors.background) {
        Column(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = JamDimens.paddingLarge)
                    .padding(bottom = SHEET_BOTTOM)
        ) {
            ThemedText(
                text = title,
                fontWeight = FontWeight.Bold,
                lineHeight = TITLE_LINE_HEIGHT,
                maxLines = 2
            )
            if (subtitle.isNotEmpty()) {
                ThemedText(
                    text = subtitle,
                    color = colors.muted,
                    fontSize = JamDimens.fontSizeSmall,
                    maxLines = 1
                )
            }

            Spacer(modifier = Modifier.height(JamDimens.marginSmall))
            Separator()
            Spacer(modifier = Modifier.height(JamDimens.margin))

            ThemedText(
                text = stringResource(R.string.rating).uppercase(),
                color = colors.muted,
                fontSize = JamDimens.fontSizeTiny,
                letterSpacing = 1.sp
            )
            Rating(
                id = id,
                size = SHEET_ICON,
                fillWidth = false,
                modifier = Modifier.padding(top = JamDimens.padding)
            )

            Spacer(modifier = Modifier.height(JamDimens.marginLarge))
            Separator()
            Spacer(modifier = Modifier.height(JamDimens.marginSmall))

            FavIcon(
                id = id,
                size = JamDimens.iconLarge,
                label = stringResource(R.string.favorite_action),
                modifier = HEADER_SHEET_ROW
            )
            actions()
        }
    }
}

@Composable
fun TrackSheet(
    track: TrackEntry,
    onOpen: () -> Unit,
    onDismiss: () -> Unit
) {
    ObjectSheet(
        id = track.id,
        title = track.title,
        subtitle = track.artist,
        onDismiss = onDismiss
    ) {
        PinIcon(
            id = track.id,
            objType = "track",
            name = track.title,
            tracks = listOf(track),
            size = JamDimens.iconLarge,
            labeled = true,
            modifier = HEADER_SHEET_ROW
        )
        SheetAction(
            iconName = "track",
            label = stringResource(R.string.open_track_details),
            onClick = onOpen
        )
    }
}

@HiltViewModel
class ObjectSheetViewModel
    @Inject
    constructor(
        private val albums: AlbumRepository,
        private val folders: FolderRepository,
        private val catalog: CatalogRepository,
        private val tracks: TrackRepository
    ) : ViewModel() {
        suspend fun tracks(
            objType: String,
            id: String
        ): List<TrackEntry>? =
            when (objType) {
                "album" -> albums.album(id).getOrNull()?.tracks
                "folder" -> folders.folder(id).getOrNull()?.tracks
                "playlist" -> catalog.playlist(id).getOrNull()?.tracks
                "podcast" -> catalog.podcast(id).getOrNull()?.episodes
                "episode" -> catalog.episode(id).getOrNull()?.let { listOf(it.track) }
                "track" -> tracks.track(id).getOrNull()?.let(::listOf)
                else -> null
            }
    }

/**
 * A list row knows a name and little else, and pinning needs the tracks, so the sheet fetches
 * them behind the pin row and leaves that one row dead until they arrive.
 */
@Composable
private fun EntrySheet(
    target: SheetObject,
    kind: ObjectKind,
    onOpen: () -> Unit,
    onDismiss: () -> Unit,
    viewModel: ObjectSheetViewModel = hiltViewModel()
) {
    var tracks by remember(target.id) { mutableStateOf<List<TrackEntry>?>(null) }

    LaunchedEffect(target.id) {
        if (kind.pinnable) tracks = viewModel.tracks(target.objType, target.id)
    }

    ObjectSheet(
        id = target.id,
        title = target.title,
        subtitle = target.subtitle,
        onDismiss = onDismiss
    ) {
        if (kind.pinnable) {
            val pinTracks = tracks
            if (pinTracks == null) {
                SheetAction(
                    iconName = "pin-outline",
                    label = stringResource(R.string.pin_action),
                    onClick = {},
                    enabled = false
                )
            } else {
                PinIcon(
                    id = target.id,
                    objType = target.objType,
                    name = target.title,
                    tracks = pinTracks,
                    size = JamDimens.iconLarge,
                    labeled = true,
                    modifier = HEADER_SHEET_ROW
                )
            }
        }
        SheetAction(
            iconName = kind.icon,
            label = stringResource(kind.goToRes),
            onClick = onOpen
        )
    }
}

@Composable
private fun SheetAction(
    iconName: String,
    label: String,
    onClick: () -> Unit,
    enabled: Boolean = true
) {
    ClickLabelIcon(
        iconName = iconName,
        label = label,
        onClick = onClick,
        size = JamDimens.iconLarge,
        muted = !enabled,
        enabled = enabled,
        modifier = HEADER_SHEET_ROW
    )
}

private data class ObjectKind(
    val icon: String,
    @StringRes val goToRes: Int,
    val pinnable: Boolean
)

/** Pinnable is what one query answers with tracks: a series or an artist holds albums, not tracks. */
private val objectKinds =
    mapOf(
        "album" to ObjectKind("album", R.string.go_to_album, true),
        "artist" to ObjectKind("artist", R.string.go_to_artist, false),
        "folder" to ObjectKind("folder", R.string.go_to_folder, true),
        "series" to ObjectKind("series", R.string.go_to_series, false),
        "playlist" to ObjectKind("playlist", R.string.go_to_playlist, true),
        "podcast" to ObjectKind("podcast", R.string.go_to_podcast, true),
        "episode" to ObjectKind("podcast", R.string.go_to_episode, true),
        "track" to ObjectKind("track", R.string.go_to_track, true)
    )

private val TITLE_LINE_HEIGHT = 22.sp
private val SHEET_ICON = 26.dp
private val SHEET_BOTTOM = 30.dp
