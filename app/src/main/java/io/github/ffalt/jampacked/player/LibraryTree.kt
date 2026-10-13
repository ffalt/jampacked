package io.github.ffalt.jampacked.player

import androidx.core.net.toUri
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.auth.AuthRepository
import io.github.ffalt.jampacked.data.repo.AlbumRepository
import io.github.ffalt.jampacked.data.repo.ArtistRepository
import io.github.ffalt.jampacked.data.repo.BrowseEntry
import io.github.ffalt.jampacked.data.repo.CatalogRepository
import io.github.ffalt.jampacked.data.repo.TrackRepository
import javax.inject.Inject
import javax.inject.Singleton

/**
 * The browse tree offered to Android Auto, Wear OS and other media browsers.
 * Node ids are "kind:value"; a bare id is a track.
 */
@Singleton
class LibraryTree
    @Inject
    constructor(
        private val auth: AuthRepository,
        private val albums: AlbumRepository,
        private val artists: ArtistRepository,
        private val catalog: CatalogRepository,
        private val tracks: TrackRepository
    ) {
        val isLoggedIn: Boolean get() = auth.session != null

        fun root(): MediaItem = folder(ROOT, "JamPacked")

        suspend fun children(
            parentId: String,
            page: Int,
            pageSize: Int
        ): List<MediaItem>? {
            val session = auth.session ?: return null
            val skip = page * pageSize
            return when {
                parentId == ROOT -> {
                    listOf(
                        folder(ALBUMS_RECENT, "Recent albums"),
                        folder(ALBUMS_FAVED, "Favourite albums"),
                        folder(ARTISTS_FAVED, "Favourite artists"),
                        folder(ARTISTS_RECENT, "Recent artists"),
                        folder(PLAYLISTS, "Playlists"),
                        folder(PODCASTS, "Podcasts")
                    )
                }

                parentId == ALBUMS_RECENT -> {
                    albums
                        .list(null, "recent", skip, pageSize)
                        .getOrNull()
                        ?.items
                        ?.map { it.toNode(session) }
                }

                parentId == ALBUMS_FAVED -> {
                    albums
                        .list(null, "faved", skip, pageSize)
                        .getOrNull()
                        ?.items
                        ?.map { it.toNode(session) }
                }

                parentId == ARTISTS_FAVED -> {
                    artists
                        .list("faved", skip, pageSize)
                        .getOrNull()
                        ?.items
                        ?.map { it.toNode(session) }
                }

                parentId == ARTISTS_RECENT -> {
                    artists
                        .list("recent", skip, pageSize)
                        .getOrNull()
                        ?.items
                        ?.map { it.toNode(session) }
                }

                parentId == PLAYLISTS -> {
                    catalog
                        .playlistIndex()
                        .getOrNull()
                        ?.drop(skip)
                        ?.take(pageSize)
                        ?.map { it.toNode(session) }
                }

                parentId == PODCASTS -> {
                    catalog
                        .podcastIndex()
                        .getOrNull()
                        ?.drop(skip)
                        ?.take(pageSize)
                        ?.map { it.toNode(session) }
                }

                parentId.startsWith(ARTIST_PREFIX) -> {
                    artists
                        .artist(parentId.removePrefix(ARTIST_PREFIX))
                        .getOrNull()
                        ?.albums
                        ?.drop(skip)
                        ?.take(pageSize)
                        ?.map { it.toNode(session) }
                }

                else -> {
                    trackList(parentId)?.drop(skip)?.take(pageSize)?.map { it.toMediaItem(session) }
                }
            }
        }

        suspend fun item(mediaId: String): MediaItem? {
            val session = auth.session ?: return null
            if (mediaId == ROOT) return root()
            if (mediaId.contains(':')) return null
            return tracks.track(mediaId).getOrNull()?.toMediaItem(session)
        }

        /** Turns what a browser asked to play into playable items: a track, or every track of a container. */
        suspend fun resolve(mediaId: String): List<MediaItem> {
            val session = auth.session ?: return emptyList()
            trackList(mediaId)?.let { list -> return list.map { it.toMediaItem(session) } }
            return listOfNotNull(tracks.track(mediaId).getOrNull()?.toMediaItem(session))
        }

        private suspend fun trackList(id: String): List<TrackEntry>? =
            when {
                id.startsWith(ALBUM_PREFIX) -> {
                    albums
                        .album(id.removePrefix(ALBUM_PREFIX))
                        .getOrNull()
                        ?.tracks
                }

                id.startsWith(PLAYLIST_PREFIX) -> {
                    catalog.playlist(id.removePrefix(PLAYLIST_PREFIX)).getOrNull()?.tracks
                }

                id.startsWith(PODCAST_PREFIX) -> {
                    catalog.podcast(id.removePrefix(PODCAST_PREFIX)).getOrNull()?.episodes
                }

                else -> {
                    null
                }
            }

        private fun BrowseEntry.toNode(session: JamSession): MediaItem {
            val prefix =
                when (kind) {
                    "album" -> ALBUM_PREFIX
                    "artist" -> ARTIST_PREFIX
                    "playlist" -> PLAYLIST_PREFIX
                    else -> PODCAST_PREFIX
                }
            // Albums and playlists open to their tracks and also play as a whole; artists and podcasts only open.
            val playable = kind == "album" || kind == "playlist"
            return MediaItem
                .Builder()
                .setMediaId(prefix + id)
                .setMediaMetadata(
                    MediaMetadata
                        .Builder()
                        .setTitle(title)
                        .setSubtitle(description)
                        .setIsBrowsable(true)
                        .setIsPlayable(playable)
                        .setMediaType(
                            when (kind) {
                                "album" -> MediaMetadata.MEDIA_TYPE_ALBUM
                                "artist" -> MediaMetadata.MEDIA_TYPE_ARTIST
                                "playlist" -> MediaMetadata.MEDIA_TYPE_PLAYLIST
                                else -> MediaMetadata.MEDIA_TYPE_PODCAST
                            }
                        ).setArtworkUri(session.imageUrl(id, size = ARTWORK_SIZE).toUri())
                        .build()
                ).build()
        }

        private fun folder(
            id: String,
            title: String
        ): MediaItem =
            MediaItem
                .Builder()
                .setMediaId(id)
                .setMediaMetadata(
                    MediaMetadata
                        .Builder()
                        .setTitle(title)
                        .setIsBrowsable(true)
                        .setIsPlayable(false)
                        .setMediaType(MediaMetadata.MEDIA_TYPE_FOLDER_MIXED)
                        .build()
                ).build()

        companion object {
            const val ROOT = "root"
            private const val ALBUMS_RECENT = "albums:recent"
            private const val ALBUMS_FAVED = "albums:faved"
            private const val ARTISTS_FAVED = "artists:faved"
            private const val ARTISTS_RECENT = "artists:recent"
            private const val PLAYLISTS = "playlists:all"
            private const val PODCASTS = "podcasts:all"
            private const val ALBUM_PREFIX = "album:"
            private const val ARTIST_PREFIX = "artist:"
            private const val PLAYLIST_PREFIX = "playlist:"
            private const val PODCAST_PREFIX = "podcast:"
            private const val ARTWORK_SIZE = 300
        }
    }
