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
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.BuildConfig
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.components.JamImage
import io.github.ffalt.jampacked.ui.components.PageHeader
import io.github.ffalt.jampacked.ui.components.RadioButtons
import io.github.ffalt.jampacked.ui.components.RadioEntry
import io.github.ffalt.jampacked.ui.components.SectionHeader
import io.github.ffalt.jampacked.ui.components.ThemedButton
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.nav.DEFAULT_NAVIGATION_TRANSITION
import io.github.ffalt.jampacked.ui.nav.NavigationTransition
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamThemeName
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import io.github.ffalt.jampacked.util.humanFileSize

@Composable
fun SettingsScreen(
    session: JamSession,
    modifier: Modifier = Modifier,
    onNavigate: (Route) -> Unit = {},
    viewModel: SettingsViewModel = hiltViewModel(),
    navigationTransition: NavigationTransition = DEFAULT_NAVIGATION_TRANSITION,
    onNavigationTransitionChange: (NavigationTransition) -> Unit = {}
) {
    val current by viewModel.theme.collectAsStateWithLifecycle()
    val cache by viewModel.cacheStats.collectAsStateWithLifecycle()
    val themeOptions =
        listOf(
            RadioEntry(JamThemeName.AUTO.name, stringResource(R.string.system_theme)),
            RadioEntry(JamThemeName.LIGHT.name, stringResource(R.string.light_theme)),
            RadioEntry(JamThemeName.DARK.name, stringResource(R.string.dark_theme)),
            RadioEntry(JamThemeName.BLACK.name, stringResource(R.string.black_theme))
        )
    val navigationTransitionOptions =
        NavigationTransition.entries.map { transition ->
            RadioEntry(transition.name, stringResource(transition.labelRes))
        }

    LaunchedEffect(Unit) { viewModel.refreshCacheStats() }

    Column(
        modifier =
            modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
    ) {
        PageHeader(title = stringResource(R.string.settings))

        Column(modifier = Modifier.padding(JamDimens.padding)) {
            SectionHeader(stringResource(R.string.user_section))
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
                    if (roles.stream) UserPermission(stringResource(R.string.stream_audio))
                    if (roles.podcast) UserPermission(stringResource(R.string.manage_podcasts))
                    if (roles.upload) UserPermission(stringResource(R.string.upload_audio))
                    if (roles.admin) UserPermission(stringResource(R.string.server_administration))
                }
                ThemedButton(stringResource(R.string.logout), onClick = viewModel::logout)
            }

            SectionHeader(stringResource(R.string.theme))
            RadioButtons(
                options = themeOptions,
                value = current.name,
                onChange = { key -> viewModel.setTheme(JamThemeName.valueOf(key)) }
            )

            SectionHeader(stringResource(R.string.screen_transitions))
            RadioButtons(
                options = navigationTransitionOptions,
                value = navigationTransition.name,
                onChange = { key ->
                    NavigationTransition.entries
                        .first { it.name == key }
                        .let(onNavigationTransitionChange)
                }
            )

            SectionHeader(stringResource(R.string.cache))
            SettingRow(
                text = stringResource(R.string.data_image_cache),
                action = { ThemedButton(stringResource(R.string.clear), onClick = viewModel::clearCache) }
            )

            SectionHeader(stringResource(R.string.pinned_offline_tracks))
            SettingRow(
                text =
                    stringResource(R.string.files_count, cache.downloadedFiles) +
                        if (cache.downloadedFiles > 0) " (${humanFileSize(cache.downloadedBytes)})" else "",
                action = { ThemedButton(stringResource(R.string.clear), onClick = viewModel::clearDownloads) }
            )

            if (BuildConfig.DEBUG) {
                SectionHeader(stringResource(R.string.debug))
                ThemedButton(stringResource(R.string.component_gallery), onClick = { onNavigate(Route.Gallery) })
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
