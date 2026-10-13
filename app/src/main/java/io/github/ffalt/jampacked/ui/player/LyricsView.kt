package io.github.ffalt.jampacked.ui.player

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.sp
import io.github.ffalt.jampacked.data.repo.Lyrics
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

@Composable
fun LyricsView(
    lyrics: Lyrics?,
    loading: Boolean,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    Column(
        modifier =
            modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        when {
            loading -> {
                CircularProgressIndicator()
            }

            lyrics == null -> {
                ThemedText("No lyrics", color = colors.muted)
            }

            else -> {
                ThemedText(lyrics.text, lineHeight = LYRIC_LINE_HEIGHT)
                lyrics.source?.let {
                    ThemedText(
                        text = it,
                        color = colors.muted,
                        fontSize = JamDimens.fontSizeTiny,
                        modifier = Modifier.padding(top = JamDimens.padding)
                    )
                }
            }
        }
    }
}

private val LYRIC_LINE_HEIGHT = 26.sp
