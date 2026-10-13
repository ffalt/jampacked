package io.github.ffalt.jampacked.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Immutable
data class JamColors(
    val name: String,
    val textColor: Color,
    val muted: Color,
    val background: Color,
    val itemBackground: Color,
    val overlayGradient: List<Color>,
    val gradient: List<Color>,
    val separator: Color,
    val activeBackgroundColor: Color,
    val control: Color,
    val sidebar: Color,
    val warning: Color,
    val progress: Color,
    val sliderHandle: Color,
    val activeTintColor: Color,
    val inactiveTintColor: Color,
    val darkStatusBarIcons: Boolean,
    val overlay: Color,
    val overlayText: Color,
    val overlayTextActive: Color,
    val coverBorder: Color,
    val statusBar: Color,
    val refreshCtrlBackground: Color,
    val refreshCtrlColors: List<Color>,
    val waveformActive: Color,
    val waveformActivePlayable: Color,
    val waveformInactive: Color,
    val checkboxChecked: Color,
    val checkboxUnchecked: Color,
    val floatingColor: Color,
    val floatingBackground: Color,
    val navPrimary: Color,
    val navCard: Color
)

object JamDimens {
    val fontSizeHuge: TextUnit = 30.sp
    val fontSizeBig: TextUnit = 24.sp
    val fontSizeLarge: TextUnit = 20.sp
    val fontSize: TextUnit = 16.sp
    val fontSizeSmall: TextUnit = 13.sp
    val fontSizeTiny: TextUnit = 11.sp
    val iconBig: Dp = 24.dp
    val iconLarge: Dp = 20.dp
    val icon: Dp = 16.dp
    val iconSmall: Dp = 13.dp
    val paddingLarge: Dp = 15.dp
    val padding: Dp = 10.dp
    val paddingSmall: Dp = 5.dp
    val marginLarge: Dp = 15.dp
    val margin: Dp = 10.dp
    val marginSmall: Dp = 5.dp
    val pageHeaderHeight: Dp = 80.dp
    val userImage: Dp = 40.dp
    val thumb: Dp = 46.dp
    val thumbMedium: Dp = 80.dp
}

val LightJamColors =
    JamColors(
        name = "light",
        darkStatusBarIcons = true,
        textColor = Color(0xFF000000),
        muted = Color(0xFF202020),
        background = Color(0xFFFFFFFF),
        itemBackground = Color(0xFFF3F3F3),
        overlayGradient = listOf(Color(0xD1FFFFFF), Color(0xEBFFFFFF)),
        gradient = listOf(Color(0xFFCFCFCF), Color(0xFFE9E9E9), Color(0xFFFFFFFF)),
        separator = Color(0xFFA3A3A3),
        activeBackgroundColor = Color(0xFFDFF8FF),
        control = Color(0xFFF3F3F3),
        sidebar = Color(0xFFFFFFFF),
        progress = Color(0xFF6C6C6E),
        sliderHandle = Color(0xFF000000),
        activeTintColor = Color(0xFF5BBCD3),
        inactiveTintColor = Color(0xFF90948B),
        warning = Color(0xFFDB3334),
        refreshCtrlBackground = Color(0xCCFFFFFF),
        refreshCtrlColors = listOf(Color(0xFF00A9E0), Color(0xFF309712)),
        overlay = Color(0x8CFFFFFF),
        overlayText = Color(0xFF000000),
        overlayTextActive = Color(0xFF062456),
        coverBorder = Color(0x38000000),
        statusBar = Color(0x73FFFFFF),
        checkboxChecked = Color(0xFF4A67AF),
        checkboxUnchecked = Color(0xFF90948B),
        floatingColor = Color(0xFF000000),
        floatingBackground = Color(0xFFF3F3F3),
        waveformActive = Color(0xFF005B00),
        waveformActivePlayable = Color(0xFF008300),
        waveformInactive = Color(0xFF808080),
        navPrimary = Color(0xFF2D7C61),
        navCard = Color(0xFFEAEAEA)
    )

val DarkJamColors =
    JamColors(
        name = "dark",
        darkStatusBarIcons = false,
        textColor = Color(0xFFEEEEEE),
        muted = Color(0xFF808080),
        background = Color(0xFF0B1821),
        itemBackground = Color(0xFF090A12),
        overlayGradient = listOf(Color(0xBF000000), Color(0xD1000000), Color(0xE00B1821)),
        gradient = listOf(Color(0xFF000000), Color(0xFF081318), Color(0xFF0B1821)),
        activeBackgroundColor = Color(0xFF053E62),
        separator = Color(0xFF0B2932),
        control = Color(0xFF191F2B),
        sidebar = Color(0xFF191F2B),
        progress = Color(0xFF6C6C6E),
        sliderHandle = Color(0xFFFFFFFF),
        activeTintColor = Color(0xFF5BBCD3),
        inactiveTintColor = Color(0xFFA2A69D),
        warning = Color(0xFFE60010),
        refreshCtrlBackground = Color(0x33000000),
        refreshCtrlColors = listOf(Color(0xFF00A9E0), Color(0xFF309712)),
        overlay = Color(0x59000000),
        overlayText = Color(0xFFFFFFFF),
        overlayTextActive = Color(0xFF93AED0),
        coverBorder = Color(0x38FFFFFF),
        statusBar = Color(0x4D000000),
        checkboxChecked = Color(0xFFFFFFFF),
        checkboxUnchecked = Color(0xFF0B2932),
        floatingColor = Color(0xFFFFFFFF),
        floatingBackground = Color(0xFF0B2932),
        waveformActive = Color(0xFF006F00),
        waveformActivePlayable = Color(0xFF008300),
        waveformInactive = Color(0xFF008300),
        navPrimary = Color(0xFF008300),
        navCard = Color(0xFF0B1821)
    )

val BlackJamColors =
    DarkJamColors.copy(
        name = "black",
        background = Color(0xFF000000),
        overlayGradient = listOf(Color(0xBF000000), Color(0xD1000000), Color(0xE0000000)),
        overlay = Color(0x59000000),
        gradient = listOf(Color(0xFF0A0C15), Color(0xFF000000)),
        sidebar = Color(0xFF000715),
        overlayTextActive = Color(0xFF87A7D6),
        floatingBackground = Color(0xFF293146),
        navCard = Color(0xFF090A12)
    )

enum class JamThemeName { AUTO, LIGHT, DARK, BLACK }

val LocalJamColors = staticCompositionLocalOf { LightJamColors }

@Composable
fun jamColorsFor(name: JamThemeName): JamColors =
    when (name) {
        JamThemeName.LIGHT -> LightJamColors
        JamThemeName.DARK -> DarkJamColors
        JamThemeName.BLACK -> BlackJamColors
        JamThemeName.AUTO -> if (isSystemInDarkTheme()) DarkJamColors else LightJamColors
    }
