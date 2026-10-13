package io.github.ffalt.jampacked.ui.icons

import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.Dp
import io.github.ffalt.jampacked.ui.theme.JamDimens

@Composable
fun JamIcon(
    name: String,
    color: Color,
    modifier: Modifier = Modifier,
    size: Dp = JamDimens.icon,
    contentDescription: String? = null
) {
    val drawable = JamIcons.byName[name] ?: return
    Icon(
        painter = painterResource(drawable),
        contentDescription = contentDescription,
        tint = color,
        modifier = modifier.size(size)
    )
}
