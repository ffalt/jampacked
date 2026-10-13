package io.github.ffalt.jampacked.ui.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

@Composable
fun JamTheme(
    themeName: JamThemeName = JamThemeName.AUTO,
    content: @Composable () -> Unit
) {
    val colors = jamColorsFor(themeName)
    val scheme =
        if (colors.darkStatusBarIcons) {
            lightColorScheme(
                primary = colors.activeTintColor,
                background = colors.background,
                surface = colors.itemBackground,
                onBackground = colors.textColor,
                onSurface = colors.textColor,
                error = colors.warning
            )
        } else {
            darkColorScheme(
                primary = colors.activeTintColor,
                background = colors.background,
                surface = colors.itemBackground,
                onBackground = colors.textColor,
                onSurface = colors.textColor,
                error = colors.warning
            )
        }

    val view = LocalView.current
    if (!view.isInEditMode) {
        val lightBars = colors.darkStatusBarIcons
        SideEffect {
            val window = (view.context as? Activity)?.window ?: return@SideEffect
            WindowCompat.getInsetsController(window, view).apply {
                isAppearanceLightStatusBars = lightBars
                isAppearanceLightNavigationBars = lightBars
            }
        }
    }

    CompositionLocalProvider(LocalJamColors provides colors) {
        MaterialTheme(colorScheme = scheme, content = content)
    }
}
