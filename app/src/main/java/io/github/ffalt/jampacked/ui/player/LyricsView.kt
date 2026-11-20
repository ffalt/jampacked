package io.github.ffalt.jampacked.ui.player

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.repo.Lyrics
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

@Composable
fun LyricsView(
    lyrics: Lyrics?,
    loading: Boolean,
    positionMs: Long? = null,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    when {
        loading -> {
            Column(
                modifier = modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                CircularProgressIndicator()
            }
        }

        lyrics == null -> {
            Column(
                modifier = modifier.fillMaxSize(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                ThemedText(stringResource(R.string.no_lyrics), color = colors.muted)
            }
        }

        else -> {
            if (lyrics.lines.isEmpty()) {
                Column(
                    modifier =
                        modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState()),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    ThemedText(lyrics.text.orEmpty(), lineHeight = LYRIC_LINE_HEIGHT)
                    LyricsSource(lyrics.source)
                }
            } else {
                val listState = rememberLazyListState()
                val activeIndex =
                    if (positionMs != null) {
                        activeLyricIndex(lyrics.lines, positionMs)
                    } else {
                        null
                    }

                LaunchedEffect(activeIndex, lyrics.lines) {
                    if (activeIndex != null) {
                        listState.animateScrollToItem(
                            activeIndex,
                            scrollOffset = -(listState.layoutInfo.viewportSize.height / 3)
                        )
                    }
                }

                LazyColumn(
                    state = listState,
                    modifier = modifier.fillMaxSize(),
                    contentPadding = PaddingValues(vertical = JamDimens.paddingLarge),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    itemsIndexed(lyrics.lines) { index, line ->
                        val active = index == activeIndex
                        ThemedText(
                            text = line.text,
                            color = if (active) colors.activeTintColor else colors.textColor,
                            fontSize = JamDimens.fontSizeLarge,
                            fontWeight = if (active) FontWeight.Bold else null,
                            textAlign = TextAlign.Center,
                            lineHeight = LYRIC_LINE_HEIGHT,
                            modifier =
                                Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = JamDimens.padding, vertical = JamDimens.paddingSmall)
                        )
                    }
                    item {
                        LyricsSource(lyrics.source)
                    }
                }
            }
        }
    }
}

@Composable
private fun LyricsSource(source: String?) {
    source?.let {
        ThemedText(
            text = it,
            color = LocalJamColors.current.muted,
            fontSize = JamDimens.fontSizeTiny,
            modifier = Modifier.padding(top = JamDimens.padding)
        )
    }
}

private val LYRIC_LINE_HEIGHT = 26.sp
