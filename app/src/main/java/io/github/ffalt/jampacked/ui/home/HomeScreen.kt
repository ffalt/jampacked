package io.github.ffalt.jampacked.ui.home

import androidx.annotation.StringRes
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.repo.HomeEntry
import io.github.ffalt.jampacked.data.repo.HomeStat
import io.github.ffalt.jampacked.ui.components.ClickIcon
import io.github.ffalt.jampacked.ui.components.ErrorView
import io.github.ffalt.jampacked.ui.components.GroupHeader
import io.github.ffalt.jampacked.ui.components.ImageItem
import io.github.ffalt.jampacked.ui.components.JamImage
import io.github.ffalt.jampacked.ui.components.LoadingView
import io.github.ffalt.jampacked.ui.components.Logo
import io.github.ffalt.jampacked.ui.components.Stat
import io.github.ffalt.jampacked.ui.components.StatEntry
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.nav.routeForKey
import io.github.ffalt.jampacked.ui.nav.routeForObject
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.JamStyles
import io.github.ffalt.jampacked.ui.theme.LocalJamColors

@Composable
fun HomeScreen(
    session: JamSession,
    onNavigate: (Route) -> Unit,
    modifier: Modifier = Modifier,
    viewModel: HomeViewModel = hiltViewModel(),
    searchViewModel: SearchViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsStateWithLifecycle()
    val search by searchViewModel.state.collectAsStateWithLifecycle()

    if (state.error != null && state.data.library.isEmpty()) {
        ErrorView(
            message = state.error!!,
            onRetry = { viewModel.load(forceRefresh = true) },
            modifier = modifier
        )
        return
    }

    val loadingLibrary = state.loading && state.data.library.isEmpty() && !search.active
    val scrollState = rememberScrollState()

    PullToRefreshBox(
        isRefreshing = state.loading && !loadingLibrary,
        onRefresh = { viewModel.load(forceRefresh = true) },
        modifier = modifier.fillMaxSize()
    ) {
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    // weight measures to nothing inside verticalScroll, so the loader drops it
                    .then(if (loadingLibrary) Modifier else Modifier.verticalScroll(scrollState))
        ) {
            Greeting(session = session, userName = state.userName, userId = state.userId)

            SearchBar(
                query = search.query,
                onQuery = searchViewModel::onQuery,
                onClear = searchViewModel::clear
            )

            if (search.active) {
                SearchResultsView(
                    state = search,
                    session = session,
                    onNavigate = onNavigate,
                    onOpenKind = searchViewModel::openKind,
                    onBackToAll = searchViewModel::backToAll,
                    onLoadMore = searchViewModel::loadMoreKind,
                    modifier =
                        Modifier
                            .fillMaxWidth()
                            .height(600.dp)
                )
                return@Column
            }

            if (loadingLibrary) {
                LoadingView(modifier = Modifier.weight(1f))
                return@Column
            }

            StatGrid(stringResource(R.string.library), state.data.library, onNavigate)

            HomeSection(
                stringResource(R.string.recently_played_albums),
                state.data.sections.albumsRecent,
                session,
                onNavigate,
                Route.AlbumList(albumType = "album", listType = "recent")
            )
            HomeSection(
                stringResource(R.string.recently_played_artists),
                state.data.sections.artistsRecent,
                session,
                onNavigate,
                Route.ArtistList(listType = "recent")
            )
            HomeSection(
                stringResource(R.string.favorite_albums),
                state.data.sections.albumsFaved,
                session,
                onNavigate,
                Route.AlbumList(albumType = "album", listType = "faved")
            )
            HomeSection(
                stringResource(R.string.favorite_artists),
                state.data.sections.artistsFaved,
                session,
                onNavigate,
                Route.ArtistList(listType = "faved")
            )

            StatChips(stringResource(R.string.collections), state.data.collections, onNavigate)
            StatChips(stringResource(R.string.favorites), state.data.favorites, onNavigate)
            StatChips(stringResource(R.string.played), state.data.played, onNavigate)

            PinnedCard(count = state.pinnedCount, onNavigate = onNavigate)

            Spacer(modifier = Modifier.height(JamDimens.marginLarge))
        }
    }
}

@Composable
private fun Greeting(
    session: JamSession,
    userName: String,
    userId: String,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    Row(
        modifier =
            modifier
                .fillMaxWidth()
                .padding(
                    start = JamDimens.padding,
                    end = JamDimens.padding,
                    top = JamDimens.paddingLarge,
                    bottom = JamDimens.padding
                ),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Logo(size = AVATAR)
        Column(
            modifier =
                Modifier
                    .weight(1f)
                    .padding(horizontal = JamDimens.padding)
        ) {
            ThemedText(
                text = stringResource(R.string.welcome_back),
                color = colors.muted,
                fontSize = JamDimens.fontSizeSmall,
                letterSpacing = 1.sp,
                maxLines = 1
            )
            ThemedText(
                text = userName,
                fontSize = JamDimens.fontSizeBig,
                fontWeight = FontWeight.Bold,
                maxLines = 1
            )
        }
        Box(
            modifier =
                Modifier
                    .size(AVATAR)
                    .clip(CircleShape)
                    .background(colors.itemBackground)
                    .border(1.dp, colors.coverBorder, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            JamIcon("user", colors.muted, size = JamDimens.iconLarge)
            JamImage(
                session = session,
                id = userId,
                size = AVATAR,
                modifier = Modifier.clip(CircleShape)
            )
        }
    }
}

@Composable
private fun StatGrid(
    label: String,
    stats: List<HomeStat>,
    onNavigate: (Route) -> Unit
) {
    if (stats.isEmpty()) return
    GroupHeader(title = label)
    stats.chunked(3).forEach { row ->
        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(horizontal = JamDimens.paddingSmall),
            horizontalArrangement = Arrangement.Start
        ) {
            row.forEach { stat ->
                Stat(
                    entry = StatEntry(stringResource(homeStatTitleRes(stat.titleKey)), stat.value),
                    onClick = { routeForKey(stat.routeKey)?.let(onNavigate) },
                    iconName = stat.icon,
                    modifier = Modifier.weight(1f)
                )
            }

            repeat(3 - row.size) { Spacer(Modifier.weight(1f)) }
        }
    }
}

/**
 * The counts derived from the library are a handful at most, so they ride as chips rather than as
 * a grid that would leave a row two thirds empty.
 */
@Composable
private fun StatChips(
    label: String,
    stats: List<HomeStat>,
    onNavigate: (Route) -> Unit
) {
    if (stats.isEmpty()) return
    GroupHeader(title = label)
    FlowRow(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(horizontal = JamDimens.padding),
        horizontalArrangement = Arrangement.spacedBy(JamDimens.margin),
        verticalArrangement = Arrangement.spacedBy(JamDimens.margin)
    ) {
        stats.forEach { stat ->
            StatChip(
                title = stringResource(homeStatTitleRes(stat.titleKey)),
                stat = stat,
                onClick = { routeForKey(stat.routeKey)?.let(onNavigate) }
            )
        }
    }
}

@Composable
private fun StatChip(
    title: String,
    stat: HomeStat,
    onClick: () -> Unit
) {
    val colors = LocalJamColors.current
    Row(
        modifier =
            Modifier
                .clip(RoundedCornerShape(percent = 50))
                .background(colors.itemBackground)
                .clickable(onClick = onClick)
                .padding(horizontal = JamDimens.paddingLarge, vertical = JamDimens.padding),
        verticalAlignment = Alignment.CenterVertically
    ) {
        JamIcon(stat.icon, colors.textColor.copy(alpha = JamStyles.ICON_ALPHA), size = JamDimens.icon)
        ThemedText(
            text = title,
            maxLines = 1,
            modifier = Modifier.padding(horizontal = JamDimens.marginSmall)
        )
        ThemedText(
            text = stat.value.toString(),
            color = colors.muted,
            fontWeight = FontWeight.Bold,
            maxLines = 1
        )
    }
}

@Composable
private fun HomeSection(
    title: String,
    entries: List<HomeEntry>,
    session: JamSession,
    onNavigate: (Route) -> Unit,
    sectionRoute: Route
) {
    if (entries.isEmpty()) return

    GroupHeader(title = title, onClick = { onNavigate(sectionRoute) })
    LazyRow(
        contentPadding = PaddingValues(horizontal = JamDimens.padding),
        horizontalArrangement = Arrangement.spacedBy(JamDimens.margin)
    ) {
        items(entries, key = { it.id }) { entry ->
            HomeCard(
                entry = entry,
                session = session,
                onClick = { routeForObject(entry.kind, entry.id, entry.name)?.let(onNavigate) }
            )
        }
    }
}

@Composable
private fun HomeCard(
    entry: HomeEntry,
    session: JamSession,
    onClick: () -> Unit
) {
    val colors = LocalJamColors.current
    val round = if (entry.kind == "artist") CircleShape else RoundedCornerShape(CARD_RADIUS)

    Column(
        modifier =
            Modifier
                .width(CARD_WIDTH)
                .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        ImageItem(
            session = session,
            id = entry.id,
            size = CARD_WIDTH,
            modifier =
                Modifier
                    .clip(round)
                    .background(colors.itemBackground)
                    .border(1.dp, colors.coverBorder, round)
        )
        ThemedText(
            text = entry.name,
            fontSize = JamDimens.fontSizeSmall,
            maxLines = 2,
            lineHeight = CARD_LINE_HEIGHT,
            // Two lines of room for every card, so a long name does not push its neighbours
            // out of line and a short one leaves no gap under the row.
            modifier =
                Modifier
                    .padding(top = JamDimens.marginSmall)
                    .height(CARD_TEXT_HEIGHT)
                    .clipToBounds()
        )
    }
}

@Composable
private fun PinnedCard(
    count: Int,
    onNavigate: (Route) -> Unit
) {
    val colors = LocalJamColors.current
    GroupHeader(title = stringResource(R.string.pinned))
    Row(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(horizontal = JamDimens.padding)
                .clip(RoundedCornerShape(CARD_RADIUS))
                .background(colors.itemBackground)
                .clickable { routeForKey("pinned")?.let(onNavigate) }
                .padding(horizontal = JamDimens.paddingLarge, vertical = JamDimens.padding),
        verticalAlignment = Alignment.CenterVertically
    ) {
        JamIcon("pin", colors.textColor.copy(alpha = JamStyles.ICON_ALPHA), size = JamDimens.iconLarge)
        ThemedText(
            text = stringResource(R.string.media),
            maxLines = 1,
            modifier =
                Modifier
                    .weight(1f)
                    .padding(horizontal = JamDimens.padding)
        )
        ThemedText(
            text = count.toString(),
            color = colors.muted,
            fontWeight = FontWeight.Bold,
            maxLines = 1
        )
        JamIcon(
            name = "right-open",
            color = colors.muted,
            size = JamDimens.iconSmall,
            modifier = Modifier.padding(start = JamDimens.paddingSmall)
        )
    }
}

@Composable
private fun SearchBar(
    query: String,
    onQuery: (String) -> Unit,
    onClear: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalJamColors.current
    Row(
        modifier =
            modifier
                .fillMaxWidth()
                .padding(horizontal = JamDimens.padding, vertical = JamDimens.paddingSmall)
                .clip(RoundedCornerShape(percent = 50))
                .background(colors.control)
                .padding(horizontal = JamDimens.paddingLarge),
        verticalAlignment = Alignment.CenterVertically
    ) {
        JamIcon(
            name = "search",
            color = if (query.isEmpty()) colors.muted else colors.textColor,
            size = JamDimens.iconLarge
        )
        BasicTextField(
            value = query,
            onValueChange = onQuery,
            singleLine = true,
            textStyle = TextStyle(color = colors.textColor, fontSize = JamDimens.fontSize),
            cursorBrush = SolidColor(colors.textColor),
            modifier =
                Modifier
                    .weight(1f)
                    .padding(horizontal = JamDimens.padding, vertical = SEARCH_PADDING),
            decorationBox = { inner ->
                if (query.isEmpty()) {
                    ThemedText(stringResource(R.string.search), color = colors.muted, maxLines = 1)
                }
                inner()
            }
        )
        if (query.isNotEmpty()) {
            ClickIcon("cancel", onClick = onClear, size = JamDimens.iconLarge)
        }
    }
}

private val AVATAR = 40.dp
private val CARD_WIDTH = 132.dp
private val CARD_RADIUS = 12.dp
private val CARD_TEXT_HEIGHT = 36.dp
private val CARD_LINE_HEIGHT = 16.sp
private val SEARCH_PADDING = 14.dp

@StringRes
private fun homeStatTitleRes(titleKey: String): Int =
    when (titleKey) {
        "artists" -> R.string.library_stat_artists
        "albums" -> R.string.library_stat_albums
        "compilations" -> R.string.library_stat_compilations
        "series" -> R.string.library_stat_series
        "audiobooks" -> R.string.library_stat_audiobooks
        "soundtracks" -> R.string.library_stat_soundtracks
        "live" -> R.string.library_stat_live
        "bootlegs" -> R.string.library_stat_bootlegs
        "eps" -> R.string.library_stat_eps
        "singles" -> R.string.library_stat_singles
        "folders" -> R.string.library_stat_folders
        "tracks" -> R.string.library_stat_tracks
        "genres" -> R.string.library_stat_genres
        "podcasts" -> R.string.library_stat_podcasts
        "bookmarks" -> R.string.library_stat_bookmarks
        "playlists" -> R.string.library_stat_playlists
        else -> error("Unknown home stat key: $titleKey")
    }
