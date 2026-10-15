package io.github.ffalt.jampacked.ui.browse

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.CollapsibleSection
import io.github.ffalt.jampacked.ui.components.ErrorView
import io.github.ffalt.jampacked.ui.components.HeaderDetail
import io.github.ffalt.jampacked.ui.components.LoadingView
import io.github.ffalt.jampacked.ui.components.ObjectHeader
import io.github.ffalt.jampacked.ui.components.ThemedButton
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import io.github.ffalt.jampacked.util.formatDuration

@Composable
fun EpisodeScreen(
    session: JamSession,
    episodeName: String,
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: EpisodeViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    if (state.error != null) {
        ErrorView(state.error!!, onRetry = { viewModel.load(true) }, modifier = modifier)
        return
    }

    val episode = state.episode
    if (episode == null) {
        LoadingView(modifier = modifier.fillMaxSize())
        return
    }

    Column(
        modifier =
            modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
    ) {
        ObjectHeader(
            session = session,
            id = episode.id,
            title = episode.name.ifEmpty { episodeName },
            typeName = stringResource(R.string.episode),
            details =
                listOfNotNull(
                    HeaderDetail(
                        stringResource(R.string.podcast_detail),
                        episode.podcastName,
                        { onNavigate(Route.Podcast(episode.podcastId, episode.podcastName)) }
                    ),
                    episode.date?.take(DATE_LENGTH)?.takeIf { it.isNotEmpty() }?.let {
                        HeaderDetail(stringResource(R.string.date_detail), it)
                    },
                    episode.track.durationMS
                        .takeIf { it > 0 }
                        ?.let {
                            HeaderDetail(stringResource(R.string.duration_detail), formatDuration(it))
                        }
                ),
            onPlay = viewModel::play.takeIf { state.playable }
        )

        if (!state.playable) {
            EpisodeNotReady(
                downloading = state.downloading,
                canRetrieve = session.roles.podcast,
                onRetrieve = viewModel::retrieve
            )
        }

        episode.summary?.trim()?.takeIf { it.isNotEmpty() }?.let { summary ->
            CollapsibleSection(title = stringResource(R.string.about_section)) {
                ThemedText(
                    text = summary,
                    lineHeight = SUMMARY_LINE_HEIGHT,
                    modifier =
                        Modifier.padding(
                            horizontal = JamDimens.padding,
                            vertical = JamDimens.paddingSmall
                        )
                )
            }
        }

        if (state.resumeAtMs > 0) {
            Row(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(JamDimens.padding),
                verticalAlignment = Alignment.CenterVertically
            ) {
                ThemedText(
                    text = stringResource(R.string.resume_at, formatDuration(state.resumeAtMs)),
                    color = LocalJamColors.current.muted,
                    modifier = Modifier.weight(1f)
                )
                ThemedButton(
                    label = stringResource(R.string.play_from_start),
                    onClick = viewModel::playFromStart
                )
            }
        }
    }
}

private const val DATE_LENGTH = 10

@Composable
private fun EpisodeNotReady(
    downloading: Boolean,
    canRetrieve: Boolean,
    onRetrieve: () -> Unit
) {
    Row(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(JamDimens.padding),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ThemedText(
            text =
                stringResource(
                    if (downloading) R.string.episode_downloading else R.string.episode_not_ready
                ),
            color = LocalJamColors.current.muted,
            modifier = Modifier.weight(1f)
        )
        if (canRetrieve && !downloading) {
            ThemedButton(label = stringResource(R.string.episode_retrieve), onClick = onRetrieve)
        }
    }
}

private val SUMMARY_LINE_HEIGHT = 22.sp
