package io.github.ffalt.jampacked.ui.placeholder

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import io.github.ffalt.jampacked.ui.components.PageHeader
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

@Composable
fun NotYetScreen(
    title: String,
    subtitle: String?,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    Column(modifier = modifier.fillMaxSize()) {
        PageHeader(
            title = title,
            subtitle = subtitle
        )
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            ThemedText("Arrives in a later Phase 4 slice.", color = colors.muted)
        }
    }
}
