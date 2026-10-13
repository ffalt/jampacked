package io.github.ffalt.jampacked.ui.nav

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

fun albumTypeLabel(albumType: String): String =
    when (albumType) {
        "album" -> "Albums"
        "compilation" -> "Compilations"
        "audiobook" -> "Audiobooks"
        "soundtrack" -> "Soundtracks"
        "live" -> "Live Albums"
        "bootleg" -> "Bootlegs"
        "ep" -> "EPs"
        "single" -> "Singles"
        "series" -> "Series"
        else -> albumType.replaceFirstChar { it.uppercase() }
    }
