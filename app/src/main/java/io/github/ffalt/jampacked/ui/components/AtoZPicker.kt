package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import kotlinx.coroutines.delay
import kotlin.time.Duration.Companion.milliseconds

@Composable
fun AtoZPicker(
    letters: List<String>,
    onLetter: (String) -> Unit,
    modifier: Modifier = Modifier,
    activeLetter: String? = null
) {
    if (letters.isEmpty()) return
    val colors = LocalJamColors.current
    var blockHeight by remember { mutableFloatStateOf(0f) }
    var bubble by remember { mutableStateOf<Pair<String, Float>?>(null) }
    var pickToken by remember { mutableIntStateOf(0) }

    fun pick(y: Float) {
        if (blockHeight <= 0f) return
        val index = ((y / blockHeight) * letters.size).toInt().coerceIn(0, letters.lastIndex)
        val letter = letters[index]
        bubble = letter to y
        pickToken++
        onLetter(letter)
    }

    LaunchedEffect(pickToken) {
        if (pickToken > 0) {
            delay(BUBBLE_HIDE_MS.milliseconds)
            bubble = null
        }
    }

    Box(modifier = modifier, contentAlignment = Alignment.CenterEnd) {
        Box(
            modifier =
                Modifier
                    .fillMaxHeight()
                    .background(colors.overlay),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier =
                    Modifier
                        .padding(horizontal = JamDimens.padding, vertical = 20.dp)
                        .onSizeChanged { blockHeight = it.height.toFloat() }
                        .pointerInput(letters) {
                            detectTapGestures(onPress = { offset -> pick(offset.y) })
                        }.pointerInput(letters) {
                            detectDragGestures(
                                onDragStart = { offset -> pick(offset.y) }
                            ) { change, _ -> pick(change.position.y) }
                        },
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                letters.forEach { letter ->
                    ThemedText(
                        text = letter,
                        color = if (letter == activeLetter) colors.overlayTextActive else colors.overlayText,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        bubble?.let { (letter, _) ->
            Box(
                modifier =
                    Modifier
                        .padding(end = 54.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(colors.floatingBackground)
                        .padding(JamDimens.padding),
                contentAlignment = Alignment.Center
            ) {
                ThemedText(letter, color = colors.floatingColor, fontSize = JamDimens.fontSize)
            }
        }
    }
}

private const val BUBBLE_HIDE_MS = 700L
