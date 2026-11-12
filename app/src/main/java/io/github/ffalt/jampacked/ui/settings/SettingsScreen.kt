package io.github.ffalt.jampacked.ui.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.BuildConfig
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.BitrateCap
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.StreamFormat
import io.github.ffalt.jampacked.data.StreamOptions
import io.github.ffalt.jampacked.data.UserRoles
import io.github.ffalt.jampacked.ui.components.GroupHeader
import io.github.ffalt.jampacked.ui.components.JamImage
import io.github.ffalt.jampacked.ui.components.RadioEntry
import io.github.ffalt.jampacked.ui.components.ScreenTitle
import io.github.ffalt.jampacked.ui.components.SettingSelect
import io.github.ffalt.jampacked.ui.components.SettingToggle
import io.github.ffalt.jampacked.ui.components.ThemedButton
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.nav.DEFAULT_NAVIGATION_TRANSITION
import io.github.ffalt.jampacked.ui.nav.NavigationTransition
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamStyles
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
    val streams by viewModel.streamSettings.collectAsStateWithLifecycle()
    val unmeteredOnly by viewModel.unmeteredOnly.collectAsStateWithLifecycle()
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
        ScreenTitle(stringResource(R.string.settings))

        UserCard(
            session = session,
            userId = viewModel.userId,
            userName = viewModel.userName,
            roles = viewModel.roles,
            onLogout = viewModel::logout
        )

        SettingsGroup(stringResource(R.string.appearance)) {
            SettingSelect(
                label = stringResource(R.string.theme),
                options = themeOptions,
                value = current.name,
                onChange = { key -> viewModel.setTheme(JamThemeName.valueOf(key)) }
            )
            GroupDivider()
            SettingSelect(
                label = stringResource(R.string.screen_transitions),
                options = navigationTransitionOptions,
                value = navigationTransition.name,
                onChange = { key ->
                    NavigationTransition.entries
                        .first { it.name == key }
                        .let(onNavigationTransitionChange)
                }
            )
        }

        SettingsGroup(
            title = stringResource(R.string.streaming_quality),
            hint = stringResource(R.string.playable_formats, viewModel.playableFormats)
        ) {
            QualityOptions(options = streams.streaming, onChange = viewModel::setStreaming)
        }

        SettingsGroup(
            title = stringResource(R.string.download_quality),
            hint = stringResource(R.string.download_quality_hint)
        ) {
            QualityOptions(options = streams.downloads, onChange = viewModel::setDownloads)
        }

        SettingsGroup(stringResource(R.string.cache)) {
            SettingRow(
                text = stringResource(R.string.data_image_cache),
                action = { ThemedButton(stringResource(R.string.clear), onClick = viewModel::clearCache) }
            )
        }

        SettingsGroup(stringResource(R.string.pinned_offline_tracks)) {
            SettingToggle(
                label = stringResource(R.string.downloads_unmetered_only),
                checked = unmeteredOnly,
                onChange = viewModel::setUnmeteredOnly
            )
            GroupDivider()
            SettingRow(
                text =
                    stringResource(R.string.files_count, cache.downloadedFiles) +
                        if (cache.downloadedFiles > 0) " (${humanFileSize(cache.downloadedBytes)})" else "",
                action = { ThemedButton(stringResource(R.string.clear), onClick = viewModel::clearDownloads) }
            )
        }

        if (BuildConfig.DEBUG) {
            SettingsGroup(stringResource(R.string.debug)) {
                LinkRow(
                    text = stringResource(R.string.component_gallery),
                    onClick = { onNavigate(Route.Gallery) }
                )
            }
        }

        Spacer(modifier = Modifier.height(JamDimens.marginLarge))
    }
}

@Composable
private fun UserCard(
    session: JamSession,
    userId: String,
    userName: String,
    roles: UserRoles,
    onLogout: () -> Unit
) {
    val colors = LocalJamColors.current
    Column(modifier = cardModifier(colors.itemBackground).padding(JamDimens.paddingLarge)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier =
                    Modifier
                        .size(AVATAR)
                        .clip(CircleShape)
                        .background(colors.background)
                        .border(1.dp, colors.coverBorder, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                JamIcon("user", colors.muted, size = JamDimens.iconBig)
                JamImage(
                    session = session,
                    id = userId,
                    size = AVATAR,
                    modifier = Modifier.clip(CircleShape)
                )
            }
            Column(
                modifier =
                    Modifier
                        .weight(1f)
                        .padding(horizontal = JamDimens.padding)
            ) {
                ThemedText(
                    text = userName,
                    fontSize = JamDimens.fontSizeLarge,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1
                )
                ThemedText(
                    text = session.server,
                    color = colors.muted,
                    fontSize = JamDimens.fontSizeSmall,
                    maxLines = 1
                )
            }
            ThemedButton(stringResource(R.string.logout), onClick = onLogout)
        }

        FlowRow(
            modifier = Modifier.padding(top = JamDimens.padding),
            horizontalArrangement = Arrangement.spacedBy(JamDimens.marginSmall),
            verticalArrangement = Arrangement.spacedBy(JamDimens.marginSmall)
        ) {
            if (roles.stream) RoleChip(stringResource(R.string.stream_audio))
            if (roles.podcast) RoleChip(stringResource(R.string.manage_podcasts))
            if (roles.upload) RoleChip(stringResource(R.string.upload_audio))
            if (roles.admin) RoleChip(stringResource(R.string.server_administration))
        }
    }
}

@Composable
private fun RoleChip(text: String) {
    val colors = LocalJamColors.current
    ThemedText(
        text = text,
        color = colors.textColor.copy(alpha = JamStyles.FOOTER_ALPHA),
        fontSize = JamDimens.fontSizeSmall,
        maxLines = 1,
        modifier =
            Modifier
                .clip(RoundedCornerShape(percent = 50))
                .background(colors.background)
                .padding(horizontal = JamDimens.padding, vertical = JamDimens.paddingSmall)
    )
}

/**
 * Every group is one card, so a setting and the rows it belongs with read as a block rather than
 * as a run of rows separated only by their headers.
 */
@Composable
private fun SettingsGroup(
    title: String,
    hint: String? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val colors = LocalJamColors.current
    GroupHeader(title = title)
    Column(
        modifier =
            cardModifier(colors.itemBackground)
                .padding(horizontal = JamDimens.paddingSmall, vertical = JamDimens.paddingSmall),
        content = content
    )
    hint?.let {
        ThemedText(
            text = it,
            color = colors.muted,
            fontSize = JamDimens.fontSizeSmall,
            modifier =
                Modifier.padding(
                    horizontal = JamDimens.paddingLarge,
                    vertical = JamDimens.paddingSmall
                )
        )
    }
}

@Composable
private fun GroupDivider() {
    Box(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(horizontal = JamDimens.paddingSmall)
                .height(JamStyles.separatorHeight)
                .background(LocalJamColors.current.separator)
    )
}

private fun cardModifier(background: Color): Modifier =
    Modifier
        .fillMaxWidth()
        .padding(horizontal = JamDimens.padding)
        .clip(RoundedCornerShape(CARD_RADIUS))
        .background(background)

@Composable
private fun QualityOptions(
    options: StreamOptions,
    onChange: (StreamOptions) -> Unit
) {
    val formatEntries =
        listOf(
            RadioEntry(StreamFormat.MP3.name, stringResource(R.string.format_mp3)),
            RadioEntry(StreamFormat.ORIGINAL.name, stringResource(R.string.format_original))
        )
    SettingSelect(
        label = stringResource(R.string.format),
        options = formatEntries,
        value = options.format.name,
        onChange = { key -> onChange(options.copy(format = StreamFormat.valueOf(key))) }
    )

    GroupDivider()

    val capEntries =
        BitrateCap.entries.map { cap ->
            val label =
                cap.kbps?.let { stringResource(R.string.bitrate_kbps, it) }
                    ?: stringResource(R.string.bitrate_uncapped)
            RadioEntry(cap.name, label)
        }
    SettingSelect(
        label = stringResource(R.string.bitrate_cap),
        options = capEntries,
        value = options.cap.name,
        onChange = { key -> onChange(options.copy(cap = BitrateCap.valueOf(key))) }
    )
}

@Composable
private fun SettingRow(
    text: String,
    action: @Composable () -> Unit
) {
    Row(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(horizontal = JamDimens.paddingSmall, vertical = JamDimens.paddingSmall),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ThemedText(text = text, modifier = Modifier.weight(1f))
        action()
    }
}

@Composable
private fun LinkRow(
    text: String,
    onClick: () -> Unit
) {
    val colors = LocalJamColors.current
    Row(
        modifier =
            Modifier
                .fillMaxWidth()
                .clickable(onClick = onClick)
                .padding(horizontal = JamDimens.paddingSmall, vertical = JamDimens.padding),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ThemedText(text = text, modifier = Modifier.weight(1f))
        JamIcon("right-open", colors.muted, size = JamDimens.iconSmall)
    }
}

private val AVATAR = 56.dp
private val CARD_RADIUS = 12.dp
