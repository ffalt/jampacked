package io.github.ffalt.jampacked.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.Dp
import io.github.ffalt.jampacked.R

@Composable
fun Logo(
    size: Dp,
    modifier: Modifier = Modifier
) {
    Image(
        painter = painterResource(R.drawable.logo),
        contentDescription = null,
        modifier = modifier.size(size)
    )
}
