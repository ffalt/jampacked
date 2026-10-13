package io.github.ffalt.jampacked.ui.nav

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.toRoute
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.ui.browse.AlbumListViewModel
import io.github.ffalt.jampacked.ui.browse.AlbumScreen
import io.github.ffalt.jampacked.ui.browse.ArtistListViewModel
import io.github.ffalt.jampacked.ui.browse.ArtistScreen
import io.github.ffalt.jampacked.ui.browse.BrowseListScreen
import io.github.ffalt.jampacked.ui.browse.FolderListViewModel
import io.github.ffalt.jampacked.ui.browse.FolderScreen
import io.github.ffalt.jampacked.ui.browse.GenreListViewModel
import io.github.ffalt.jampacked.ui.browse.GenreScreen
import io.github.ffalt.jampacked.ui.browse.PlaylistListViewModel
import io.github.ffalt.jampacked.ui.browse.PlaylistViewModel
import io.github.ffalt.jampacked.ui.browse.PodcastListViewModel
import io.github.ffalt.jampacked.ui.browse.PodcastViewModel
import io.github.ffalt.jampacked.ui.browse.SeriesListViewModel
import io.github.ffalt.jampacked.ui.browse.SeriesScreen
import io.github.ffalt.jampacked.ui.browse.TrackCollectionScreen
import io.github.ffalt.jampacked.ui.browse.TrackListScreen
import io.github.ffalt.jampacked.ui.gallery.GalleryScreen
import io.github.ffalt.jampacked.ui.home.HomeScreen
import io.github.ffalt.jampacked.ui.offline.BookmarksScreen
import io.github.ffalt.jampacked.ui.offline.DownloadsScreen
import io.github.ffalt.jampacked.ui.offline.PinnedMediaScreen
import io.github.ffalt.jampacked.ui.placeholder.NotYetScreen
import io.github.ffalt.jampacked.ui.player.PlayerScreen
import io.github.ffalt.jampacked.ui.player.QueueScreen
import io.github.ffalt.jampacked.ui.settings.SettingsScreen
import io.github.ffalt.jampacked.ui.track.TrackScreen

@Composable
fun JamNavHost(
    navController: NavHostController,
    session: JamSession,
    modifier: Modifier = Modifier
) {
    NavHost(
        navController = navController,
        startDestination = Route.Home,
        modifier = modifier
    ) {
        composable<Route.Home> {
            HomeScreen(
                session = session,
                onNavigate = { navController.navigate(it) }
            )
        }
        composable<Route.Queue> { QueueScreen(session = session) }
        composable<Route.Player> {
            PlayerScreen(
                session = session,
                onClose = { navController.popBackStack() },
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.Settings> {
            SettingsScreen(
                session = session,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.Gallery> { GalleryScreen() }

        composable<Route.Album> {
            AlbumScreen(
                session = session,
                albumName = it.toRoute<Route.Album>().name,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.Artist> {
            ArtistScreen(
                session = session,
                artistName = it.toRoute<Route.Artist>().name,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.Folder> {
            FolderScreen(
                session = session,
                folderName = it.toRoute<Route.Folder>().name,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.Track> {
            val route = it.toRoute<Route.Track>()
            TrackScreen(
                session = session,
                trackId = route.id,
                trackName = route.name,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.Playlist> {
            val viewModel: PlaylistViewModel = hiltViewModel()
            val state by viewModel.state.collectAsStateWithLifecycle()
            TrackCollectionScreen(
                session = session,
                state = state,
                showArtist = true,
                fallbackTitle = it.toRoute<Route.Playlist>().name,
                onReload = { viewModel.load(true) },
                onPlayAll = viewModel::playAll,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.Podcast> {
            val viewModel: PodcastViewModel = hiltViewModel()
            val state by viewModel.state.collectAsStateWithLifecycle()
            TrackCollectionScreen(
                session = session,
                state = state,
                showArtist = false,
                fallbackTitle = it.toRoute<Route.Podcast>().name,
                onReload = { viewModel.load(true) },
                onPlayAll = viewModel::playAll,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.Episode> { NotYetScreen("Episode", it.toRoute<Route.Episode>().name) }
        composable<Route.Series> {
            SeriesScreen(
                session = session,
                seriesName = it.toRoute<Route.Series>().name,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.Genre> {
            val route = it.toRoute<Route.Genre>()
            GenreScreen(
                session = session,
                genreId = route.id,
                genreName = route.name,
                onNavigate = { target -> navController.navigateSibling<Route.Genre>(target) }
            )
        }

        composable<Route.AlbumList> {
            val route = it.toRoute<Route.AlbumList>()
            val viewModel: AlbumListViewModel = hiltViewModel()
            val state by viewModel.state.collectAsStateWithLifecycle()
            BrowseListScreen(
                session = session,
                state = state,
                onReload = { viewModel.load(true) },
                onLoadMore = viewModel::loadMore,
                onNavigate = { target -> navController.navigateSibling<Route.AlbumList>(target) },
                siblingRoute = { listType -> Route.AlbumList(route.albumType, listType) }
            )
        }
        composable<Route.ArtistList> {
            val viewModel: ArtistListViewModel = hiltViewModel()
            val state by viewModel.state.collectAsStateWithLifecycle()
            BrowseListScreen(
                session = session,
                state = state,
                onReload = { viewModel.load(true) },
                onLoadMore = viewModel::loadMore,
                onNavigate = { target -> navController.navigateSibling<Route.ArtistList>(target) },
                siblingRoute = { listType -> Route.ArtistList(listType) }
            )
        }
        composable<Route.TrackList> {
            TrackListScreen(
                onNavigate = { target -> navController.navigateSibling<Route.TrackList>(target) }
            )
        }
        composable<Route.FolderList> {
            val viewModel: FolderListViewModel = hiltViewModel()
            val state by viewModel.state.collectAsStateWithLifecycle()
            BrowseListScreen(
                session = session,
                state = state,
                onReload = { viewModel.load(true) },
                onLoadMore = viewModel::loadMore,
                onNavigate = { target -> navController.navigateSibling<Route.FolderList>(target) },
                siblingRoute = { listType -> Route.FolderList(listType) }
            )
        }
        composable<Route.SeriesList> {
            val viewModel: SeriesListViewModel = hiltViewModel()
            val state by viewModel.state.collectAsStateWithLifecycle()
            BrowseListScreen(
                session = session,
                state = state,
                onReload = { viewModel.load(true) },
                onLoadMore = viewModel::loadMore,
                onNavigate = { target -> navController.navigateSibling<Route.SeriesList>(target) },
                siblingRoute = { listType -> Route.SeriesList(listType) }
            )
        }
        composable<Route.GenreList> {
            val viewModel: GenreListViewModel = hiltViewModel()
            val state by viewModel.state.collectAsStateWithLifecycle()
            BrowseListScreen(
                session = session,
                state = state,
                onReload = { viewModel.load(true) },
                onLoadMore = viewModel::loadMore,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.PlaylistList> {
            val viewModel: PlaylistListViewModel = hiltViewModel()
            val state by viewModel.state.collectAsStateWithLifecycle()
            BrowseListScreen(
                session = session,
                state = state,
                onReload = { viewModel.load(true) },
                onLoadMore = viewModel::loadMore,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.PodcastList> {
            val viewModel: PodcastListViewModel = hiltViewModel()
            val state by viewModel.state.collectAsStateWithLifecycle()
            BrowseListScreen(
                session = session,
                state = state,
                onReload = { viewModel.load(true) },
                onLoadMore = viewModel::loadMore,
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.Bookmarks> {
            BookmarksScreen(
                onNavigate = { target -> navController.navigate(target) }
            )
        }
        composable<Route.PinnedMedia> {
            PinnedMediaScreen(
                session = session,
                onNext = { navController.navigate(Route.Downloads(active = true)) }
            )
        }
        composable<Route.Downloads> { entry ->

            val route = entry.toRoute<Route.Downloads>()

            fun go(target: Route) =
                navController.navigate(target) {
                    popUpTo<Route.Downloads> { inclusive = true }
                }
            DownloadsScreen(
                onPrevious = {
                    if (route.active) go(Route.PinnedMedia) else go(Route.Downloads(active = true))
                },
                onNext = if (route.active) ({ go(Route.Downloads(active = false)) }) else null
            )
        }
    }
}

private inline fun <reified T : Route> NavController.navigateSibling(target: Route) {
    if (target is T) {
        navigate(target) { popUpTo<T> { inclusive = true } }
    } else {
        navigate(target)
    }
}
