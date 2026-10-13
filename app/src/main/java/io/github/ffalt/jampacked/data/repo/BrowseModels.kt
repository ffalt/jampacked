package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.data.TrackEntry
import kotlinx.serialization.Serializable

@Serializable
data class BrowseEntry(
    val id: String,
    val title: String,
    val description: String = "",
    val kind: String
)

@Serializable
data class BrowseIndex(
    val groups: List<BrowseIndexGroup> = emptyList()
)

@Serializable
data class BrowseIndexGroup(
    val letter: String,
    val items: List<BrowseEntry> = emptyList()
)

@Serializable
data class BrowsePage(
    val items: List<BrowseEntry> = emptyList(),
    val total: Int = 0,
    val skip: Int = 0,
    val take: Int = 0
) {
    val hasMore: Boolean get() = skip + items.size < total
}

@Serializable
data class BrowseSection(
    val title: String,
    val items: List<BrowseEntry> = emptyList()
)

@Serializable
data class AlbumDetail(
    val id: String,
    val name: String,
    val albumType: String?,
    val artist: String,
    val artistId: String?,
    val trackCount: Int,
    val genres: List<String> = emptyList(),
    val genreId: String? = null,
    val tracks: List<TrackEntry> = emptyList()
)

@Serializable
data class ArtistDetail(
    val id: String,
    val name: String,
    val albumCount: Int,
    val trackCount: Int,
    val genres: List<String> = emptyList(),
    val genreId: String? = null,
    val albums: List<BrowseEntry> = emptyList(),
    val sections: List<BrowseSection> = emptyList()
)
