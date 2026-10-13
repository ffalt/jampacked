package io.github.ffalt.jampacked.ui.settings

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.BuildConfig
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.JamImage
import io.github.ffalt.jampacked.ui.components.PageHeader
import io.github.ffalt.jampacked.ui.components.RadioButtons
import io.github.ffalt.jampacked.ui.components.RadioEntry
import io.github.ffalt.jampacked.ui.components.SectionHeader
import io.github.ffalt.jampacked.ui.components.ThemedButton
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamThemeName
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import io.github.ffalt.jampacked.util.humanFileSize

private val themeOptions =
    listOf(
        RadioEntry(JamThemeName.AUTO.name, "System Theme"),
        RadioEntry(JamThemeName.LIGHT.name, "Light"),
        RadioEntry(JamThemeName.DARK.name, "Dark"),
        RadioEntry(JamThemeName.BLACK.name, "Black")
    )

@Composable
fun SettingsScreen(
    session: JamSession,
    modifier: Modifier = Modifier,
    onNavigate: (Route) -> Unit = {},
    viewModel: SettingsViewModel = hiltViewModel()
) {
    val current by viewModel.theme.collectAsStateWithLifecycle()
    val cache by viewModel.cacheStats.collectAsStateWithLifecycle()

    LaunchedEffect(Unit) { viewModel.refreshCacheStats() }

    Column(
        modifier =
            modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
    ) {
        PageHeader(title = "Settings")

        Column(modifier = Modifier.padding(JamDimens.padding)) {
            SectionHeader("Cache")
            SettingRow(
                text = "Data & Image Cache",
                action = { ThemedButton("Clear", onClick = viewModel::clearCache) }
            )

            SectionHeader("Pinned Offline Tracks")
            SettingRow(
                text =
                    "Files:${cache.downloadedFiles}" +
                        if (cache.downloadedFiles > 0) " (${humanFileSize(cache.downloadedBytes)})" else "",
                action = { ThemedButton("Clear", onClick = viewModel::clearDownloads) }
            )

            SectionHeader("Theme")
            RadioButtons(
                options = themeOptions,
                value = current.name,
                onChange = { key -> viewModel.setTheme(JamThemeName.valueOf(key)) }
            )

            SectionHeader("User")
            Row(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(top = JamDimens.padding, bottom = JamDimens.paddingLarge)
            ) {
                JamImage(
                    session = session,
                    id = viewModel.userId,
                    size = JamDimens.thumbMedium,
                    modifier = Modifier.padding(end = JamDimens.margin)
                )
                Column(modifier = Modifier.weight(1f)) {
                    ThemedText(viewModel.userName)
                    val roles = viewModel.roles
                    if (roles.stream) UserPermission("Stream Audio")
                    if (roles.podcast) UserPermission("Manage Podcasts")
                    if (roles.upload) UserPermission("Upload Audio")
                    if (roles.admin) UserPermission("Server Administration")
                }
                ThemedButton("Logout", onClick = viewModel::logout)
            }

            if (BuildConfig.DEBUG) {
                SectionHeader("Debug")
                ThemedButton("Component gallery", onClick = { onNavigate(Route.Gallery) })
            }
        }
    }
}

@Composable
private fun SettingRow(
    text: String,
    action: @Composable () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ThemedText(
            text = text,
            modifier =
                Modifier
                    .weight(1f)
                    .padding(start = JamDimens.paddingSmall)
        )
        action()
    }
}

@Composable
private fun UserPermission(text: String) {
    val colors = LocalJamColors.current
    Row(verticalAlignment = Alignment.CenterVertically) {
        JamIcon("checkmark", colors.textColor)
        ThemedText(
            text = text,
            fontSize = PERMISSION_FONT_SIZE,
            modifier = Modifier.padding(horizontal = JamDimens.paddingSmall)
        )
    }
}

private val PERMISSION_FONT_SIZE = 12.sp
