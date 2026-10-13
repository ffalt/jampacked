package io.github.ffalt.jampacked.ui.nav

import kotlinx.serialization.Serializable

sealed interface Route {
    @Serializable
    data object Home : Route

    @Serializable
    data object Queue : Route

    @Serializable
    data object Player : Route

    @Serializable
    data object Settings : Route

    @Serializable
    data object Gallery : Route

    @Serializable
    data class Album(
        val id: String,
        val name: String
    ) : Route

    @Serializable
    data class Artist(
        val id: String,
        val name: String
    ) : Route

    @Serializable
    data class Folder(
        val id: String,
        val name: String
    ) : Route

    @Serializable
    data class Track(
        val id: String,
        val name: String
    ) : Route

    @Serializable
    data class Playlist(
        val id: String,
        val name: String
    ) : Route

    @Serializable
    data class Podcast(
        val id: String,
        val name: String
    ) : Route

    @Serializable
    data class Episode(
        val id: String,
        val name: String
    ) : Route

    @Serializable
    data class Series(
        val id: String,
        val name: String
    ) : Route

    @Serializable
    data class Genre(
        val id: String,
        val name: String,
        val tab: String = GenreTab.ARTISTS
    ) : Route

    @Serializable
    data class AlbumList(
        val albumType: String,
        val listType: String? = null
    ) : Route

    @Serializable
    data class ArtistList(
        val listType: String? = null
    ) : Route

    @Serializable
    data class TrackList(
        val listType: String? = null
    ) : Route

    @Serializable
    data class FolderList(
        val listType: String? = null
    ) : Route

    @Serializable
    data class SeriesList(
        val listType: String? = null
    ) : Route

    @Serializable
    data object GenreList : Route

    @Serializable
    data object PlaylistList : Route

    @Serializable
    data object PodcastList : Route

    @Serializable
    data object Bookmarks : Route

    @Serializable
    data object PinnedMedia : Route

    @Serializable
    data class Downloads(
        val active: Boolean = false
    ) : Route
}

object DeepLinks {
    const val PLAYER = "jampacked://player"
}

object GenreTab {
    const val ARTISTS = "artists"
    const val ALBUMS = "albums"
    const val TRACKS = "tracks"

    val order = listOf(ARTISTS, ALBUMS, TRACKS)

    fun subtitle(tab: String): String =
        when (tab) {
            ALBUMS -> "Albums in Genre"
            TRACKS -> "Tracks in Genre"
            else -> "Artists in Genre"
        }
}

enum class TabRoute(
    val label: String,
    val icon: String,
    val route: Route
) {
    HOME("Home", "home", Route.Home),
    QUEUE("Queue", "queue", Route.Queue),
    SETTINGS("Settings", "settings", Route.Settings)
}
