package io.github.ffalt.jampacked.ui.placeholder

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import io.github.ffalt.jampacked.R
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
            ThemedText(stringResource(R.string.arrives_later), color = colors.muted)
        }
    }
}
