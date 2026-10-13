package io.github.ffalt.jampacked.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
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
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.repo.HomeEntry
import io.github.ffalt.jampacked.data.repo.HomeStat
import io.github.ffalt.jampacked.ui.components.ClickIcon
import io.github.ffalt.jampacked.ui.components.ErrorView
import io.github.ffalt.jampacked.ui.components.ImageItem
import io.github.ffalt.jampacked.ui.components.JamImage
import io.github.ffalt.jampacked.ui.components.Logo
import io.github.ffalt.jampacked.ui.components.SectionHeader
import io.github.ffalt.jampacked.ui.components.Stat
import io.github.ffalt.jampacked.ui.components.StatEntry
import io.github.ffalt.jampacked.ui.components.ThemedText
import io.github.ffalt.jampacked.ui.icons.JamIcon
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.nav.routeForKey
import io.github.ffalt.jampacked.ui.nav.routeForObject
import io.github.ffalt.jampacked.ui.theme.JamDimens
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

    PullToRefreshBox(
        isRefreshing = state.loading,
        onRefresh = { viewModel.load(forceRefresh = true) },
        modifier = modifier.fillMaxSize()
    ) {
        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
        ) {
            Row(
                modifier =
                    Modifier
                        .fillMaxWidth()
                        .padding(horizontal = JamDimens.padding, vertical = JamDimens.padding * 2),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Logo(size = JamDimens.userImage)

                ThemedText(
                    text = "Welcome, ${state.userName}",
                    fontSize = JamDimens.fontSizeLarge,
                    maxLines = 2,
                    textAlign = TextAlign.Center,
                    modifier =
                        Modifier
                            .weight(1f)
                            .padding(horizontal = JamDimens.padding)
                )
                JamImage(
                    session = session,
                    id = state.userId,
                    size = JamDimens.userImage,
                    modifier = Modifier.clip(CircleShape)
                )
            }

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

            StatGrid("Library", state.data.library, onNavigate)
            HomeSection(
                "Recently Played Albums",
                state.data.sections.albumsRecent,
                session,
                onNavigate,
                Route.AlbumList(albumType = "album", listType = "recent")
            )
            HomeSection(
                "Recently Played Artists",
                state.data.sections.artistsRecent,
                session,
                onNavigate,
                Route.ArtistList(listType = "recent")
            )
            HomeSection(
                "Favorite Albums",
                state.data.sections.albumsFaved,
                session,
                onNavigate,
                Route.AlbumList(albumType = "album", listType = "faved")
            )
            HomeSection(
                "Favorite Artists",
                state.data.sections.artistsFaved,
                session,
                onNavigate,
                Route.ArtistList(listType = "faved")
            )
            StatGrid("Collections", state.data.collections, onNavigate)
            StatGrid("Favorites", state.data.favorites, onNavigate)
            StatGrid("Played", state.data.played, onNavigate)

            StatGrid(
                label = "Pinned",
                stats = listOf(HomeStat("Media", "pin", state.pinnedCount, "pinned")),
                onNavigate = onNavigate
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
    SectionHeader(label)
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
                    entry = StatEntry(stat.title, stat.value),
                    onClick = { routeForKey(stat.routeKey)?.let(onNavigate) },
                    modifier = Modifier.weight(1f)
                )
            }

            repeat(3 - row.size) { Spacer(Modifier.weight(1f)) }
        }
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
    val colors = LocalJamColors.current

    SectionHeader(
        title = title,
        modifier = Modifier.clickable { onNavigate(sectionRoute) },
        trailing = { JamIcon("right-open", colors.muted, size = JamDimens.iconSmall) }
    )
    LazyRow(
        contentPadding =
            androidx.compose.foundation.layout
                .PaddingValues(horizontal = JamDimens.padding),
        horizontalArrangement = Arrangement.spacedBy(JamDimens.margin)
    ) {
        items(entries, key = { it.id }) { entry ->

            Column(
                modifier =
                    Modifier
                        .width(120.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(colors.itemBackground)
                        .clickable {
                            routeForObject(entry.kind, entry.id, entry.name)?.let(onNavigate)
                        }.padding(top = JamDimens.padding),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                ImageItem(session = session, id = entry.id, size = JamDimens.thumbMedium)
                ThemedText(
                    text = entry.name,
                    fontSize = JamDimens.fontSizeSmall,
                    maxLines = 1,
                    modifier = Modifier.padding(vertical = JamDimens.marginSmall)
                )
            }
        }
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
                .padding(horizontal = JamDimens.padding)
                .drawBehind {
                    val y = size.height - 1f
                    drawLine(colors.separator, Offset(0f, y), Offset(size.width, y), 1f)
                },
        verticalAlignment = Alignment.CenterVertically
    ) {
        JamIcon(
            name = "search",
            color = colors.textColor.copy(alpha = if (query.isEmpty()) 0.3f else 1f),
            size = 22.dp,
            modifier = Modifier.padding(horizontal = JamDimens.padding)
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
                    .padding(top = 10.dp, end = 10.dp, bottom = 10.dp),
            decorationBox = { inner ->
                if (query.isEmpty()) {
                    ThemedText("Search", color = colors.muted)
                }
                inner()
            }
        )
        if (query.isNotEmpty()) {
            ClickIcon("cancel", onClick = onClear, size = 22.dp)
        }
    }
}
