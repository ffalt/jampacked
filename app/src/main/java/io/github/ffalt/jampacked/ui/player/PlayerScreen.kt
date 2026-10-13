package io.github.ffalt.jampacked.ui.player

import androidx.compose.animation.Crossfade
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.detectVerticalDragGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.pluralStringResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil3.compose.AsyncImage
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.repo.Lyrics
import io.github.ffalt.jampacked.player.RepeatMode
import io.github.ffalt.jampacked.ui.components.ClickIcon
import io.github.ffalt.jampacked.ui.components.ClickLabelIcon
import io.github.ffalt.jampacked.ui.components.DurationText
import io.github.ffalt.jampacked.ui.components.FavIcon
import io.github.ffalt.jampacked.ui.components.Rating
import io.github.ffalt.jampacked.ui.components.Separator
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.components.Waveform
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

private enum class PlayerSheet { NONE, QUEUE, MORE }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlayerScreen(
    session: JamSession,
    onClose: () -> Unit,
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: PlayerViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val extras by viewModel.extras.collectAsStateWithLifecycle()
    val colors = LocalJamColors.current
    val track = state.current
    var showLyrics by remember { mutableStateOf(false) }
    var sheet by remember { mutableStateOf(PlayerSheet.NONE) }

    val leaveTo: (Route) -> Unit = { route ->
        onClose()
        onNavigate(route)
    }

    Column(
        modifier =
            modifier
                .fillMaxSize()
                .padding(bottom = JamDimens.padding)
    ) {
        PlayerTopBar(
            album = track?.album,
            onClose = onClose,
            onAlbum = track?.albumID?.let { id -> { leaveTo(Route.Album(id, track.album)) } },
            onMore = { sheet = PlayerSheet.MORE }
        )

        PlayerFace(
            session = session,
            trackId = track?.id,
            showLyrics = showLyrics,
            lyrics = extras.lyrics,
            lyricsLoading = extras.lyricsLoading,
            onToggleFace = { showLyrics = !showLyrics },
            onPrevious = viewModel::previous,
            onNext = viewModel::next,
            modifier = Modifier.weight(1f)
        )

        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = GUTTER, vertical = JamDimens.padding),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                TrackLine(
                    text = track?.title.orEmpty(),
                    fontSize = JamDimens.fontSizeLarge,
                    fontWeight = FontWeight.Bold,
                    maxLines = 2,
                    onClick = track?.let { { leaveTo(Route.Track(it.id, it.title)) } }
                )
                TrackLine(
                    text = track?.artist.orEmpty(),
                    color = colors.muted,
                    onClick =
                        track?.artistID?.let { id ->
                            { leaveTo(Route.Artist(id, track.artist)) }
                        }
                )
            }
            track?.id?.let { FavIcon(id = it, size = ANNOTATION_ICON) }
        }

        val progress =
            if (state.durationMs > 0) {
                state.positionMs.toFloat() / state.durationMs
            } else {
                0f
            }

        Column(modifier = Modifier.padding(horizontal = GUTTER)) {
            if (extras.waveform == null) {
                PlayerSeekBar(
                    progress = progress,
                    onSeek = viewModel::seekPercent,
                    enabled = state.durationMs > 0
                )
            } else {
                Waveform(
                    waveform = extras.waveform,
                    progress = progress,
                    playableProgress = 1f,
                    activeColor = colors.waveformActive,
                    playableColor = colors.waveformActivePlayable,
                    inactiveColor = colors.waveformInactive,
                    handleColor = colors.sliderHandle,
                    onSeek = viewModel::seekPercent,
                    height = WAVEFORM_HEIGHT
                )
            }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                DurationText(
                    state.positionMs,
                    fontSize = JamDimens.fontSizeTiny,
                    color = colors.muted
                )
                DurationText(
                    state.durationMs,
                    fontSize = JamDimens.fontSizeTiny,
                    color = colors.muted
                )
            }
        }

        PlayerControls(
            isPlaying = state.isPlaying,
            hasPrevious = state.currentIndex > 0,
            hasNext = state.currentIndex in 0 until state.queue.lastIndex,
            onToggle = viewModel::toggle,
            onPrevious = viewModel::previous,
            onNext = viewModel::next,
            onBackward = viewModel::backward,
            onForward = viewModel::forward,
            modifier = Modifier.padding(vertical = JamDimens.padding)
        )

        QueueBar(
            queueSize = state.queue.size,
            shuffle = state.shuffle,
            repeat = state.repeat,
            onShuffle = viewModel::toggleShuffle,
            onRepeat = viewModel::cycleRepeat,
            onOpenQueue = { sheet = PlayerSheet.QUEUE }
        )
    }

    when (sheet) {
        PlayerSheet.NONE -> {}

        PlayerSheet.QUEUE -> {
            ModalBottomSheet(
                onDismissRequest = { sheet = PlayerSheet.NONE },
                containerColor = colors.background
            ) {
                PlayerQueue(
                    modifier = Modifier.padding(bottom = SHEET_BOTTOM),
                    session = session,
                    state = state,
                    onSkipTo = { index ->
                        viewModel.skipTo(index)
                        sheet = PlayerSheet.NONE
                    },
                    onRemove = viewModel::remove,
                    onMove = viewModel::move,
                    onClear = {
                        viewModel.clearQueue()
                        sheet = PlayerSheet.NONE
                    },
                    onShuffle = viewModel::shuffleQueue
                )
            }
        }

        PlayerSheet.MORE -> {
            ModalBottomSheet(
                onDismissRequest = { sheet = PlayerSheet.NONE },
                containerColor = colors.background
            ) {
                TrackSheet(
                    track = track,
                    onNavigate = { route ->
                        sheet = PlayerSheet.NONE
                        leaveTo(route)
                    }
                )
            }
        }
    }
}

@Composable
private fun PlayerTopBar(
    album: String?,
    onClose: () -> Unit,
    onAlbum: (() -> Unit)?,
    onMore: () -> Unit
) {
    val colors = LocalJamColors.current
    Column(
        modifier =
            Modifier
                .fillMaxWidth()
                .pointerInput(Unit) {
                    var travelled = 0f
                    detectVerticalDragGestures(
                        onDragStart = { travelled = 0f },
                        onDragEnd = { if (travelled > DISMISS_DRAG.toPx()) onClose() }
                    ) { _, amount -> travelled += amount }
                }
    ) {
        Box(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .clickable(onClick = onClose)
                    .padding(vertical = JamDimens.padding),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier =
                    Modifier
                        .width(HANDLE_WIDTH)
                        .height(HANDLE_HEIGHT)
                        .clip(CircleShape)
                        .background(colors.separator)
            )
        }
        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(start = GUTTER, end = JamDimens.paddingSmall),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(
                modifier =
                    Modifier
                        .weight(1f)
                        .then(if (onAlbum != null) Modifier.clickable(onClick = onAlbum) else Modifier)
            ) {
                if (!album.isNullOrEmpty()) {
                    ThemedText(
                        text = stringResource(R.string.playing_from_album).uppercase(),
                        color = colors.muted,
                        fontSize = JamDimens.fontSizeTiny,
                        letterSpacing = 1.sp
                    )
                    ThemedText(
                        text = album,
                        fontSize = JamDimens.fontSizeSmall,
                        maxLines = 1
                    )
                }
            }
            ClickIcon("ellipsis-vert", onClick = onMore, size = JamDimens.iconBig)
        }
    }
}

@Composable
private fun PlayerFace(
    session: JamSession,
    trackId: String?,
    showLyrics: Boolean,
    lyrics: Lyrics?,
    lyricsLoading: Boolean,
    onToggleFace: () -> Unit,
    onPrevious: () -> Unit,
    onNext: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    Box(
        modifier =
            modifier
                .fillMaxWidth()
                .padding(horizontal = GUTTER, vertical = JamDimens.padding)
                .pointerInput(Unit) { detectTapGestures { onToggleFace() } }
                .then(
                    if (showLyrics) {
                        Modifier
                    } else {
                        Modifier.pointerInput(trackId) {
                            var travelled = 0f
                            detectHorizontalDragGestures(
                                onDragStart = { travelled = 0f },
                                onDragEnd = {
                                    val threshold = SWIPE_TRACK.toPx()
                                    if (travelled > threshold) onPrevious()
                                    if (travelled < -threshold) onNext()
                                }
                            ) { _, amount -> travelled += amount }
                        }
                    }
                ),
        contentAlignment = Alignment.Center
    ) {
        Crossfade(targetState = showLyrics, label = "player-face") { lyricsShown ->
            if (lyricsShown) {
                LyricsView(lyrics = lyrics, loading = lyricsLoading)
            } else if (trackId != null) {
                AsyncImage(
                    model = session.imageUrl(trackId, size = 600),
                    contentDescription = null,
                    contentScale = ContentScale.Fit,
                    modifier =
                        Modifier
                            .fillMaxSize()
                            .aspectRatio(1f)
                            .clip(RoundedCornerShape(COVER_RADIUS))
                            .border(1.dp, colors.coverBorder, RoundedCornerShape(COVER_RADIUS))
                )
            }
        }
    }
}

@Composable
private fun QueueBar(
    queueSize: Int,
    shuffle: Boolean,
    repeat: RepeatMode,
    onShuffle: () -> Unit,
    onRepeat: () -> Unit,
    onOpenQueue: () -> Unit
) {
    val colors = LocalJamColors.current
    Row(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(horizontal = JamDimens.padding),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ClickIcon(
            iconName = "shuffle",
            onClick = onShuffle,
            size = JamDimens.iconLarge,
            color = if (shuffle) colors.navPrimary else colors.muted
        )
        RepeatIcon(repeat = repeat, onClick = onRepeat)

        Spacer(modifier = Modifier.weight(1f))

        Row(
            modifier =
                Modifier
                    .clip(RoundedCornerShape(4.dp))
                    .clickable(onClick = onOpenQueue)
                    .padding(JamDimens.paddingSmall),
            verticalAlignment = Alignment.CenterVertically
        ) {
            ThemedText(
                text = pluralStringResource(R.plurals.queue_tracks_count, queueSize, queueSize),
                color = colors.muted,
                fontSize = JamDimens.fontSizeSmall
            )
            JamIcon(
                name = "up-open",
                color = colors.muted,
                size = JamDimens.iconSmall,
                modifier = Modifier.padding(start = JamDimens.paddingSmall)
            )
        }
    }
}

@Composable
private fun RepeatIcon(
    repeat: RepeatMode,
    onClick: () -> Unit
) {
    val colors = LocalJamColors.current
    Box(contentAlignment = Alignment.Center) {
        ClickIcon(
            iconName = "loop",
            onClick = onClick,
            size = JamDimens.iconLarge,
            color = if (repeat == RepeatMode.OFF) colors.muted else colors.navPrimary
        )
        if (repeat == RepeatMode.ONE) {
            // The icon set has no repeat-one glyph, so the mode is marked with a badge.
            Box(
                modifier =
                    Modifier
                        .align(Alignment.BottomEnd)
                        .clip(CircleShape)
                        .background(colors.background)
            ) {
                ThemedText(
                    text = "1",
                    color = colors.navPrimary,
                    fontSize = JamDimens.fontSizeSmall,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
private fun TrackSheet(
    track: TrackEntry?,
    onNavigate: (Route) -> Unit
) {
    if (track == null) return
    val colors = LocalJamColors.current
    Column(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(horizontal = GUTTER)
                .padding(bottom = SHEET_BOTTOM)
    ) {
        ThemedText(
            text = stringResource(R.string.rating).uppercase(),
            color = colors.muted,
            fontSize = JamDimens.fontSizeTiny,
            letterSpacing = 1.sp,
            modifier = Modifier.padding(bottom = JamDimens.padding)
        )
        Rating(id = track.id, size = ANNOTATION_ICON, fillWidth = false)

        Spacer(modifier = Modifier.height(JamDimens.marginLarge))
        Separator()
        Spacer(modifier = Modifier.height(JamDimens.marginSmall))

        ClickLabelIcon(
            iconName = "track",
            label = stringResource(R.string.go_to_track),
            onClick = { onNavigate(Route.Track(track.id, track.title)) },
            size = JamDimens.iconLarge,
            modifier = SHEET_ROW
        )
        track.albumID?.let { id ->
            ClickLabelIcon(
                iconName = "album",
                label = stringResource(R.string.go_to_album),
                onClick = { onNavigate(Route.Album(id, track.album)) },
                size = JamDimens.iconLarge,
                modifier = SHEET_ROW
            )
        }
        track.artistID?.let { id ->
            ClickLabelIcon(
                iconName = "artist",
                label = stringResource(R.string.go_to_artist),
                onClick = { onNavigate(Route.Artist(id, track.artist)) },
                size = JamDimens.iconLarge,
                modifier = SHEET_ROW
            )
        }
    }
}

@Composable
private fun TrackLine(
    text: String,
    onClick: (() -> Unit)?,
    fontSize: TextUnit = JamDimens.fontSize,
    fontWeight: FontWeight? = null,
    color: Color? = null,
    maxLines: Int = 1
) {
    if (text.isEmpty()) return
    ThemedText(
        text = text,
        color = color,
        fontSize = fontSize,
        fontWeight = fontWeight,
        maxLines = maxLines,
        lineHeight = fontSize * LINE_HEIGHT_RATIO,
        modifier = if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun PlayerSeekBar(
    progress: Float,
    onSeek: (Float) -> Unit,
    enabled: Boolean
) {
    val colors = LocalJamColors.current
    var dragging by remember { mutableFloatStateOf(-1f) }

    val sliderColors =
        SliderDefaults.colors(
            thumbColor = colors.sliderHandle,
            activeTrackColor = colors.activeTintColor,
            inactiveTrackColor = colors.inactiveTintColor
        )
    val value = if (dragging >= 0f) dragging else progress

    Slider(
        value = value,
        onValueChange = { dragging = it },
        onValueChangeFinished = {
            if (dragging >= 0f) {
                onSeek(dragging)
                dragging = -1f
            }
        },
        enabled = enabled,
        colors = sliderColors,
        thumb = {
            Box(
                modifier =
                    Modifier
                        .size(THUMB_SIZE)
                        .clip(CircleShape)
                        .background(colors.sliderHandle)
            )
        },
        track = { sliderState ->
            SliderDefaults.Track(
                sliderState = sliderState,
                colors = sliderColors,
                thumbTrackGapSize = 0.dp,
                trackInsideCornerSize = 0.dp,
                drawStopIndicator = null,
                modifier = Modifier.height(TRACK_HEIGHT)
            )
        },
        modifier = Modifier.height(WAVEFORM_HEIGHT)
    )
}

private val GUTTER = 20.dp

private val WAVEFORM_HEIGHT = 64.dp

private val HANDLE_WIDTH = 36.dp
private val HANDLE_HEIGHT = 4.dp

private val ANNOTATION_ICON = 26.dp
private val SHEET_BOTTOM = 30.dp
private val SHEET_ROW =
    Modifier
        .fillMaxWidth()
        .padding(vertical = 6.dp)

private val DISMISS_DRAG = 60.dp
private val SWIPE_TRACK = 80.dp

private val THUMB_SIZE = 20.dp
private val TRACK_HEIGHT = 4.dp

private val COVER_RADIUS = 12.dp

private const val LINE_HEIGHT_RATIO = 1.25f
