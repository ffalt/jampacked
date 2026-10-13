package io.github.ffalt.jampacked.data

import kotlinx.serialization.Serializable

@Serializable
data class TrackEntry(
    val id: String,
    val title: String,
    val artist: String = "",
    val album: String = "",
    val durationMS: Long = 0,
    val trackNr: String = "",
    val genre: String? = null,
    val albumID: String? = null,
    val artistID: String? = null,
    val seriesID: String? = null,
    val podcastID: String? = null
) {
    val artworkId: String get() = if (seriesID != null) id else (albumID ?: id)
}
