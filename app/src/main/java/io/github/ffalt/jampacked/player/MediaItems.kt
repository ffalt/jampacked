package io.github.ffalt.jampacked.player

import android.os.Bundle
import androidx.core.net.toUri
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.TrackEntry

fun TrackEntry.toMediaItem(
    session: JamSession,
    format: String = "mp3"
): MediaItem =
    MediaItem
        .Builder()
        .setMediaId(id)
        .setUri(session.streamUrl(id, format))
        .setMediaMetadata(
            MediaMetadata
                .Builder()
                .setTitle(title)
                .setArtist(artist)
                .setAlbumTitle(album)
                .setGenre(genre)
                .setArtworkUri(session.imageUrl(artworkId, size = 300).toUri())
                .setExtras(
                    Bundle().apply {
                        putLong(EXTRA_DURATION_MS, durationMS)
                        putString(EXTRA_TRACK_NR, trackNr)
                        putString(EXTRA_ALBUM_ID, albumID)
                        putString(EXTRA_ARTIST_ID, artistID)
                        putString(EXTRA_SERIES_ID, seriesID)
                        putString(EXTRA_PODCAST_ID, podcastID)
                    }
                ).build()
        ).build()

fun MediaItem.toTrackEntry(): TrackEntry {
    val extras = mediaMetadata.extras
    return TrackEntry(
        id = mediaId,
        title = mediaMetadata.title?.toString().orEmpty(),
        artist = mediaMetadata.artist?.toString().orEmpty(),
        album = mediaMetadata.albumTitle?.toString().orEmpty(),
        durationMS = extras?.getLong(EXTRA_DURATION_MS) ?: 0,
        trackNr = extras?.getString(EXTRA_TRACK_NR).orEmpty(),
        genre = mediaMetadata.genre?.toString(),
        albumID = extras?.getString(EXTRA_ALBUM_ID),
        artistID = extras?.getString(EXTRA_ARTIST_ID),
        seriesID = extras?.getString(EXTRA_SERIES_ID),
        podcastID = extras?.getString(EXTRA_PODCAST_ID)
    )
}

private const val EXTRA_DURATION_MS = "jam.durationMS"
private const val EXTRA_TRACK_NR = "jam.trackNr"
private const val EXTRA_ALBUM_ID = "jam.albumID"
private const val EXTRA_ARTIST_ID = "jam.artistID"
private const val EXTRA_SERIES_ID = "jam.seriesID"
private const val EXTRA_PODCAST_ID = "jam.podcastID"
