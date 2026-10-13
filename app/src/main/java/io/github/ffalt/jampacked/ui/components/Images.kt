package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.Dp
import coil3.compose.AsyncImage
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

@Composable
fun JamImage(
    session: JamSession,
    id: String,
    size: Dp,
    modifier: Modifier = Modifier,
    requestSize: Int = 80,
    format: String = "webp"
) {
    if (id.isEmpty()) return
    AsyncImage(
        model = session.imageUrl(id, size = requestSize, format = format),
        contentDescription = null,
        contentScale = ContentScale.Fit,
        modifier = modifier.size(size)
    )
}

@Composable
fun ImageItem(
    session: JamSession,
    id: String,
    size: Dp,
    modifier: Modifier = Modifier,
    requestSize: Int = 300
) {
    if (id.isEmpty()) return
    Box(modifier = modifier.size(size)) {
        AsyncImage(
            model = session.imageUrl(id, size = requestSize),
            contentDescription = null,
            contentScale = ContentScale.Fit,
            modifier = Modifier.fillMaxSize()
        )
    }
}

@Composable
fun JamThumb(
    session: JamSession,
    id: String,
    modifier: Modifier = Modifier
) {
    JamImage(session = session, id = id, size = JamDimens.thumb, modifier = modifier)
}

@Composable
fun JamBackgroundImage(
    session: JamSession,
    id: String,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val colors = LocalJamColors.current
    Box(modifier = modifier) {
        if (id.isNotEmpty()) {
            AsyncImage(
                model = session.imageUrl(id, size = 300),
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier.matchParentSize()
            )
            Box(
                modifier =
                    Modifier
                        .matchParentSize()
                        .background(Brush.verticalGradient(colors.overlayGradient))
            )
        }
        content()
    }
}
