package io.github.ffalt.jampacked.ui.nav

import androidx.annotation.StringRes
import io.github.ffalt.jampacked.R

fun routeForKey(key: String): Route? {
    val parts = key.split(":")
    val listType = parts.getOrNull(2) ?: parts.getOrNull(1)?.takeIf { parts[0] != "albums" }
    return when (parts[0]) {
        "artists" -> {
            Route.ArtistList(listType)
        }

        "albums" -> {
            Route.AlbumList(
                albumType = parts.getOrElse(1) { "album" },
                listType = parts.getOrNull(2)
            )
        }

        "series" -> {
            Route.SeriesList(listType)
        }

        "folders" -> {
            Route.FolderList(listType)
        }

        "tracks" -> {
            Route.TrackList(listType)
        }

        "genres" -> {
            Route.GenreList
        }

        "podcasts" -> {
            Route.PodcastList
        }

        "playlists" -> {
            Route.PlaylistList
        }

        "bookmarks" -> {
            Route.Bookmarks
        }

        "pinned" -> {
            Route.PinnedMedia
        }

        else -> {
            null
        }
    }
}

fun routeForObject(
    objType: String,
    id: String,
    name: String
): Route? =
    when (objType) {
        "album" -> Route.Album(id, name)
        "artist" -> Route.Artist(id, name)
        "folder" -> Route.Folder(id, name)
        "track" -> Route.Track(id, name)
        "playlist" -> Route.Playlist(id, name)
        "podcast" -> Route.Podcast(id, name)
        "episode" -> Route.Episode(id, name)
        "series" -> Route.Series(id, name)
        "genre" -> Route.Genre(id, name)
        else -> null
    }

@StringRes
fun albumTypeLabelRes(albumType: String): Int? =
    when (albumType) {
        "album" -> R.string.albums
        "compilation" -> R.string.compilations
        "audiobook" -> R.string.audiobooks
        "soundtrack" -> R.string.soundtracks
        "live" -> R.string.live_albums
        "bootleg" -> R.string.bootlegs
        "ep" -> R.string.eps
        "single" -> R.string.singles
        "series" -> R.string.series
        else -> null
    }
