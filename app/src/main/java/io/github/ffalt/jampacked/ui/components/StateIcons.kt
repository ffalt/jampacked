package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.Dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import kotlinx.coroutines.launch

@Composable
fun FavIcon(
    id: String,
    modifier: Modifier = Modifier,
    size: Dp = JamDimens.icon,
    label: String? = null,
    viewModel: ObjectStateViewModel = hiltViewModel()
) {
    var faved by remember(id) { mutableStateOf<Boolean?>(null) }
    var busy by remember(id) { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(id) {
        faved = viewModel.isFaved(id)
    }

    val iconName = if (faved == true) "heart-full" else "heart-empty"
    val muted = faved == null || busy
    val toggle = {
        if (!busy) {
            val next = !(faved ?: false)
            faved = next
            busy = true
            scope.launch {
                val confirmed = viewModel.setFaved(id, next)
                if (confirmed != null) faved = confirmed
                busy = false
            }
        }
    }

    if (label == null) {
        ClickIcon(iconName, onClick = toggle, modifier = modifier, size = size, muted = muted)
    } else {
        ClickLabelIcon(
            iconName = iconName,
            label = label,
            onClick = toggle,
            modifier = modifier,
            size = size,
            muted = muted
        )
    }
}

@Composable
fun Rating(
    id: String,
    modifier: Modifier = Modifier,
    size: Dp = JamDimens.icon,
    fillWidth: Boolean = true,
    viewModel: ObjectStateViewModel = hiltViewModel()
) {
    var rating by remember(id) { mutableIntStateOf(0) }
    var loaded by remember(id) { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(id) {
        rating = viewModel.rating(id)
        loaded = true
    }

    Row(
        modifier = if (fillWidth) modifier.fillMaxWidth() else modifier,
        horizontalArrangement =
            if (fillWidth) {
                Arrangement.SpaceEvenly
            } else {
                Arrangement.spacedBy(JamDimens.paddingLarge)
            },
        verticalAlignment = Alignment.CenterVertically
    ) {
        val colors = LocalJamColors.current
        (1..5).forEach { star ->
            Box(
                modifier =
                    Modifier.clickable {
                        val next = if (star == rating) 0 else star
                        rating = next
                        scope.launch { viewModel.setRating(id, next)?.let { rating = it } }
                    },
                contentAlignment = Alignment.Center
            ) {
                JamIcon(
                    name = if (star <= rating) "star-full" else "star-empty",
                    color = if (loaded) colors.textColor else colors.muted,
                    size = size
                )
            }
        }
    }
}

@Composable
fun PinIcon(
    id: String,
    objType: String,
    name: String,
    tracks: List<TrackEntry>,
    modifier: Modifier = Modifier,
    size: Dp = JamDimens.icon,
    labeled: Boolean = false,
    viewModel: ObjectStateViewModel = hiltViewModel()
) {
    var pinned by remember(id) { mutableStateOf(false) }
    var busy by remember(id) { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(id) { pinned = viewModel.isPinned(id) }

    val iconName = if (pinned) "pin" else "download"
    val toggle = {
        if (!busy) {
            busy = true
            scope.launch {
                pinned = viewModel.togglePin(id, objType, name, tracks)
                busy = false
            }
        }
    }

    if (labeled) {
        ClickLabelIcon(
            iconName = iconName,
            label =
                stringResource(
                    if (pinned) R.string.remove_download else R.string.download
                ),
            onClick = toggle,
            modifier = modifier,
            size = size,
            muted = busy
        )
    } else {
        ClickIcon(iconName, onClick = toggle, modifier = modifier, size = size, muted = busy)
    }
}
