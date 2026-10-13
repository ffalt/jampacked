package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
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
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import kotlinx.coroutines.delay
import kotlin.math.ceil
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
    var trackTop by remember { mutableFloatStateOf(0f) }
    var slotPx by remember { mutableFloatStateOf(0f) }
    var bubble by remember { mutableStateOf<String?>(null) }
    var pickToken by remember { mutableIntStateOf(0) }

    fun pick(y: Float) {
        if (slotPx <= 0f) return
        val index = ((y - trackTop) / slotPx).toInt().coerceIn(0, letters.lastIndex)
        val letter = letters[index]
        bubble = letter
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
        BoxWithConstraints(
            modifier =
                Modifier
                    .fillMaxHeight()
                    .width(STRIP_WIDTH)
                    .background(colors.overlay)
                    .pointerInput(letters) {
                        detectTapGestures(onPress = { offset -> pick(offset.y) })
                    }.pointerInput(letters) {
                        detectDragGestures(
                            onDragStart = { offset -> pick(offset.y) }
                        ) { change, _ -> pick(change.position.y) }
                    },
            contentAlignment = Alignment.Center
        ) {
            val density = LocalDensity.current
            val available = (maxHeight - STRIP_PADDING * 2).coerceAtLeast(0.dp)
            val slot = minOf(MAX_SLOT, available / letters.size)
            // When the slots get too small to read, label only every step-th letter; all stay pickable.
            val step = if (slot >= MIN_LABEL_SLOT) 1 else ceil(MIN_LABEL_SLOT / slot).toInt()
            val activeIndex = letters.indexOf(activeLetter)
            SideEffect {
                slotPx = with(density) { slot.toPx() }
                trackTop = with(density) { (maxHeight - slot * letters.size).toPx() } / 2f
            }
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                letters.forEachIndexed { index, letter ->
                    Box(
                        modifier = Modifier.height(slot).fillMaxWidth(),
                        contentAlignment = Alignment.Center
                    ) {
                        if (index % step == 0 || index == activeIndex) {
                            ThemedText(
                                text = letter,
                                color = if (index == activeIndex) colors.overlayTextActive else colors.overlayText,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }

        bubble?.let { letter ->
            Box(
                modifier =
                    Modifier
                        .padding(end = STRIP_WIDTH + 2.dp)
                        .size(56.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(colors.floatingBackground),
                contentAlignment = Alignment.Center
            ) {
                ThemedText(letter, color = colors.floatingColor, fontSize = JamDimens.fontSize)
            }
        }
    }
}

private val STRIP_WIDTH = 40.dp
private val STRIP_PADDING = 8.dp
private val MAX_SLOT = 18.dp
private val MIN_LABEL_SLOT = 16.dp
private const val BUBBLE_HIDE_MS = 700L
