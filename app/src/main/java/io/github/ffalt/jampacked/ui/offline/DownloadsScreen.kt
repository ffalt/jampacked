package io.github.ffalt.jampacked.ui.offline

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.ui.components.ClickLabelIcon
import io.github.ffalt.jampacked.ui.components.ListEmpty
import io.github.ffalt.jampacked.ui.components.LoadingView
import io.github.ffalt.jampacked.ui.components.PageHeader
import io.github.ffalt.jampacked.ui.components.Separator
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.components.swipeBetweenPages
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamStyles
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import io.github.ffalt.jampacked.util.humanFileSize
import java.util.Locale

@Composable
fun DownloadsScreen(
    modifier: Modifier = Modifier,
    onPrevious: () -> Unit = {},
    onNext: (() -> Unit)? = null,
    viewModel: DownloadsViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val colors = LocalJamColors.current

    Column(
        modifier =
            modifier
                .fillMaxSize()
                .swipeBetweenPages(onPrevious = onPrevious, onNext = onNext)
    ) {
        PageHeader(
            title = stringResource(if (viewModel.active) R.string.active_downloads else R.string.all_downloads),
            subtitle = stringResource(R.string.pinned_media)
        )

        Separator()
        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .height(BAR_HEIGHT)
                    .padding(horizontal = JamDimens.paddingLarge),
            verticalAlignment = Alignment.CenterVertically
        ) {
            ClickLabelIcon(
                iconName = if (state.paused) "play" else "pause",
                label =
                    stringResource(
                        if (state.paused) R.string.resume_downloads else R.string.pause_downloads
                    ),
                onClick = viewModel::togglePaused,
                modifier = Modifier.weight(1f)
            )
        }
        Separator()

        if (state.downloads.isEmpty()) {
            if (state.loading) {
                LoadingView(modifier = Modifier.weight(1f))
            } else {
                ListEmpty(items = emptyList<String>())
            }
            return@Column
        }

        LazyColumn(modifier = Modifier.fillMaxSize()) {
            items(state.downloads, key = { it.info.id }) { row ->
                val info = row.info
                val percent = info.percent.coerceAtLeast(0f)
                Column(
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .height(JamStyles.itemHeight)
                            .padding(horizontal = JamDimens.padding),
                    verticalArrangement = Arrangement.Center
                ) {
                    ThemedText(
                        text = row.track?.let { "${it.album}-${it.title}" } ?: stringResource(R.string.loading),
                        maxLines = 1
                    )
                    Row(
                        modifier =
                            Modifier
                                .fillMaxWidth()
                                .padding(bottom = FOOTER_GAP),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        val footer = colors.textColor.copy(alpha = JamStyles.footerAlpha)
                        ThemedText(info.state, color = footer, fontSize = JamDimens.fontSizeSmall)
                        ThemedText(
                            text = String.format(Locale.ROOT, "%.2f%%", percent),
                            color = footer,
                            fontSize = JamDimens.fontSizeSmall
                        )
                        ThemedText(
                            text = humanFileSize(info.bytes),
                            color = footer,
                            fontSize = JamDimens.fontSizeSmall
                        )
                    }

                    Box(
                        modifier =
                            Modifier
                                .fillMaxWidth()
                                .height(PROGRESS_HEIGHT)
                                .background(colors.separator)
                    ) {
                        Box(
                            modifier =
                                Modifier
                                    .fillMaxWidth((percent / 100f).coerceIn(0f, 1f))
                                    .height(PROGRESS_HEIGHT)
                                    .background(colors.progress)
                        )
                    }
                }
                Separator()
            }
        }
    }
}

private val BAR_HEIGHT = 32.dp

private val FOOTER_GAP = 5.dp
private val PROGRESS_HEIGHT = 2.dp
