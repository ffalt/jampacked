package io.github.ffalt.jampacked.ui.browse

import androidx.annotation.StringRes
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.CollapsibleSection
import io.github.ffalt.jampacked.ui.components.ErrorView
import io.github.ffalt.jampacked.ui.components.JamList
import io.github.ffalt.jampacked.ui.components.ObjectHeader
import io.github.ffalt.jampacked.ui.components.SelectableTrackItem
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.components.TrackSelectionOverlay
import io.github.ffalt.jampacked.ui.components.rememberTrackSelection
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

@Composable
private fun CollectionAbout(
    subtitle: String?,
    facts: List<CollectionFact>
) {
    val description = subtitle.orEmpty().trim()
    if (description.isEmpty() && facts.isEmpty()) return

    val colors = LocalJamColors.current
    CollapsibleSection(title = stringResource(R.string.about_section)) {
        Column(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = JamDimens.padding, vertical = JamDimens.paddingSmall),
            verticalArrangement = Arrangement.spacedBy(JamDimens.paddingSmall)
        ) {
            if (description.isNotEmpty()) {
                ThemedText(text = description, lineHeight = DESCRIPTION_LINE_HEIGHT)
            }
            facts.forEach { fact ->
                Row(modifier = Modifier.fillMaxWidth()) {
                    ThemedText(
                        text = stringResource(collectionFactLabel(fact.label)),
                        color = colors.muted,
                        fontSize = JamDimens.fontSizeSmall,
                        modifier = Modifier.width(FACT_LABEL_WIDTH)
                    )
                    ThemedText(
                        text = fact.value,
                        fontSize = JamDimens.fontSizeSmall,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }
    }
}

@StringRes
private fun collectionFactLabel(label: String): Int =
    when (label) {
        "author" -> R.string.author_detail
        "categories" -> R.string.categories_detail
        "language" -> R.string.language_detail
        "episodes" -> R.string.episodes_detail
        "last_check" -> R.string.last_check_detail
        "status" -> R.string.status_detail
        else -> R.string.error_detail
    }

@Composable
fun TrackCollectionScreen(
    session: JamSession,
    state: TrackCollectionUiState,
    fallbackTitle: String,
    onReload: () -> Unit,
    onPlayAll: () -> Unit,
    onNavigate: (Route) -> Unit,
    showArtist: Boolean,
    modifier: Modifier = Modifier
) {
    val selection = rememberTrackSelection()

    if (state.error != null) {
        ErrorView(state.error, onRetry = onReload, modifier = modifier)
        return
    }

    Column(modifier = modifier.fillMaxSize()) {
        Box(modifier = Modifier.weight(1f)) {
            JamList(
                items = state.tracks,
                onReload = onReload,
                loading = state.loading,
                key = { index, track -> "$index-${track.id}" },
                header = {
                    Column {
                        ObjectHeader(
                            session = session,
                            id = state.id,
                            title = state.title.ifEmpty { fallbackTitle },
                            typeName = state.objType,
                            onPlay = onPlayAll.takeIf { state.tracks.isNotEmpty() },
                        )
                        CollectionAbout(subtitle = state.subtitle, facts = state.facts)
                    }
                }
            ) { _, track ->
                SelectableTrackItem(state = selection, track = track, showArtist = showArtist)
            }

            TrackSelectionOverlay(
                state = selection,
                modifier = Modifier.align(Alignment.BottomEnd),
                onOpenTrack = { track ->
                    val target =
                        if (track.podcastID != null) {
                            Route.Episode(track.id, track.title)
                        } else {
                            Route.Track(track.id, track.title)
                        }
                    onNavigate(target)
                }
            )
        }
    }
}

private val FACT_LABEL_WIDTH = 110.dp
private val DESCRIPTION_LINE_HEIGHT = 22.sp
