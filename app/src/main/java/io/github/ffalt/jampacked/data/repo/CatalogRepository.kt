package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.cache.QueryCache
import io.github.ffalt.jampacked.graphql.GenreIndexResultQuery
import io.github.ffalt.jampacked.graphql.PlaylistIndexResultQuery
import io.github.ffalt.jampacked.graphql.PlaylistResultQuery
import io.github.ffalt.jampacked.graphql.PodcastIndexResultQuery
import io.github.ffalt.jampacked.graphql.PodcastResultQuery
import io.github.ffalt.jampacked.graphql.SeriesIndexResultQuery
import io.github.ffalt.jampacked.graphql.SeriesListResultQuery
import io.github.ffalt.jampacked.graphql.SeriesResultQuery
import kotlinx.serialization.Serializable
import kotlinx.serialization.serializer
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class SeriesDetail(
    val id: String,
    val name: String,
    val artist: String?,
    val artistId: String?,
    val trackCount: Int,
    val albums: List<BrowseEntry> = emptyList(),
    val sections: List<BrowseSection> = emptyList()
)

@Serializable
data class PlaylistDetail(
    val id: String,
    val name: String,
    val comment: String?,
    val tracks: List<TrackEntry> = emptyList()
)

@Serializable
data class PodcastDetail(
    val id: String,
    val name: String,
    val description: String?,
    val episodes: List<TrackEntry> = emptyList()
)

@Singleton
class CatalogRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider,
        private val cache: QueryCache
    ) {
        suspend fun genreIndex(forceRefresh: Boolean = false): Result<BrowseIndex> =
            runCatching {
                cached("GenreIndexResult", forceRefresh) {
                    val groups =
                        apollo
                            .client()
                            .query(GenreIndexResultQuery())
                            .execute()
                            .data
                            ?.genreIndex
                            ?.groups
                            .orEmpty()
                            .map { group ->
                                BrowseIndexGroup(
                                    letter = group.name,
                                    items =
                                        group.items.map {
                                            BrowseEntry(
                                                id = it.id,
                                                title = it.name,
                                                description =
                                                    listOfNotNull(
                                                        it.albumCount.takeIf { c -> c > 0 }?.let { c -> "$c albums" },
                                                        it.trackCount.takeIf { c -> c > 0 }?.let { c -> "$c tracks" }
                                                    ).joinToString(" / "),
                                                kind = "genre"
                                            )
                                        }
                                )
                            }
                    BrowseIndex(groups)
                }
            }

        suspend fun seriesIndex(forceRefresh: Boolean = false): Result<BrowseIndex> =
            runCatching {
                cached("SeriesIndexResult", forceRefresh) {
                    val groups =
                        apollo
                            .client()
                            .query(SeriesIndexResultQuery())
                            .execute()
                            .data
                            ?.seriesIndex
                            ?.groups
                            .orEmpty()
                            .map { group ->
                                BrowseIndexGroup(
                                    letter = group.name,
                                    items =
                                        group.items.map {
                                            BrowseEntry(it.id, it.name, "${it.albumsCount} albums", "series")
                                        }
                                )
                            }
                    BrowseIndex(groups)
                }
            }

        suspend fun seriesList(
            listType: String?,
            skip: Int,
            take: Int
        ): Result<BrowsePage> =
            runCatching {
                val response =
                    apollo
                        .client()
                        .query(
                            SeriesListResultQuery(
                                listType = listType?.toListType(),
                                seed = null,
                                albumTypes = null,
                                genreIDs = null,
                                take = take,
                                skip = skip
                            )
                        ).execute()
                val serieses =
                    response.data?.serieses
                        ?: throw IllegalStateException(response.exception?.message ?: "No data")
                BrowsePage(
                    items =
                        serieses.items.map {
                            BrowseEntry(it.id, it.name, "${it.albumsCount} albums", "series")
                        },
                    total = serieses.total,
                    skip = serieses.skip ?: skip,
                    take = serieses.take ?: take
                )
            }

        suspend fun series(
            id: String,
            forceRefresh: Boolean = false
        ): Result<SeriesDetail> =
            runCatching {
                cached("SeriesResult", forceRefresh, id) {
                    val series =
                        apollo
                            .client()
                            .query(SeriesResultQuery(id))
                            .execute()
                            .data
                            ?.series
                            ?: throw IllegalStateException("Series not found")

                    val seriesAlbums = series.albums.orEmpty()
                    val seriesAlbumEntries =
                        seriesAlbums.map { album ->
                            BrowseEntry(
                                id = album.id,
                                title = album.name,
                                description = albumEntryDescription(album.seriesNr, album.year),
                                kind = "album"
                            )
                        }
                    val seriesAlbumTypes = seriesAlbums.map { it.albumType.rawValue }
                    SeriesDetail(
                        id = series.id,
                        name = series.name,
                        artist = series.artist?.name,
                        artistId = series.artist?.id,
                        trackCount = series.tracksCount,
                        albums = seriesAlbumEntries,
                        sections = browseSections(seriesAlbumEntries, seriesAlbumTypes)
                    )
                }
            }

        suspend fun playlistIndex(forceRefresh: Boolean = false): Result<List<BrowseEntry>> =
            runCatching {
                cached("PlaylistIndexResult", forceRefresh) {
                    apollo
                        .client()
                        .query(PlaylistIndexResultQuery())
                        .execute()
                        .data
                        ?.playlists
                        ?.items
                        .orEmpty()
                        .map {
                            BrowseEntry(it.id, it.name, "${it.entriesCount} entries", "playlist")
                        }
                }
            }

        suspend fun playlist(
            id: String,
            forceRefresh: Boolean = false
        ): Result<PlaylistDetail> =
            runCatching {
                cached("PlaylistResult", forceRefresh, id) {
                    val playlist =
                        apollo
                            .client()
                            .query(PlaylistResultQuery(id))
                            .execute()
                            .data
                            ?.playlist
                            ?: throw IllegalStateException("Playlist not found")
                    PlaylistDetail(
                        id = playlist.id,
                        name = playlist.name,
                        comment = playlist.comment,
                        tracks =
                            playlist.entries.orEmpty().mapNotNull { entry ->
                                entry.track?.let { track ->
                                    TrackEntry(
                                        id = track.id,
                                        title = track.tag?.title ?: track.name,
                                        artist = track.artist?.name.orEmpty(),
                                        album = track.album?.name.orEmpty(),
                                        durationMS = (track.tag?.mediaDuration ?: 0.0).toLong(),
                                        trackNr =
                                            track.tag
                                                ?.trackNr
                                                ?.toString()
                                                .orEmpty(),
                                        albumID = track.album?.id,
                                        artistID = track.artist?.id,
                                        seriesID = track.series?.id
                                    )
                                } ?: entry.episode?.let { episode ->
                                    TrackEntry(
                                        id = episode.id,
                                        title = episode.tag?.title ?: episode.name,
                                        artist = episode.tag?.artist.orEmpty(),
                                        album = episode.tag?.album.orEmpty(),
                                        durationMS = (episode.tag?.mediaDuration ?: 0.0).toLong(),
                                        podcastID = episode.podcast.id
                                    )
                                }
                            }
                    )
                }
            }

        suspend fun podcastIndex(forceRefresh: Boolean = false): Result<List<BrowseEntry>> =
            runCatching {
                cached("PodcastIndexResult", forceRefresh) {
                    apollo
                        .client()
                        .query(PodcastIndexResultQuery())
                        .execute()
                        .data
                        ?.podcasts
                        ?.items
                        .orEmpty()
                        .map {
                            BrowseEntry(it.id, it.name, "${it.episodesCount} episodes", "podcast")
                        }
                }
            }

        suspend fun podcast(
            id: String,
            forceRefresh: Boolean = false
        ): Result<PodcastDetail> =
            runCatching {
                cached("PodcastResult", forceRefresh, id) {
                    val podcast =
                        apollo
                            .client()
                            .query(PodcastResultQuery(id))
                            .execute()
                            .data
                            ?.podcast
                            ?: throw IllegalStateException("Podcast not found")
                    PodcastDetail(
                        id = podcast.id,
                        name = podcast.name,
                        description = podcast.description,
                        episodes =
                            podcast.episodes.orEmpty().map { episode ->
                                TrackEntry(
                                    id = episode.id,
                                    title = episode.tag?.title ?: episode.name,
                                    artist = episode.tag?.artist.orEmpty(),
                                    durationMS = (episode.duration ?: 0.0).toLong(),
                                    podcastID = podcast.id
                                )
                            }
                    )
                }
            }

        private suspend inline fun <reified T> cached(
            operation: String,
            forceRefresh: Boolean,
            id: String? = null,
            fetch: () -> T
        ): T {
            val key = QueryCache.cacheKey(operation, id)
            if (!forceRefresh) {
                cache.read(key, serializer<T>())?.let { return it }
            }
            return fetch().also { cache.write(key, it, serializer<T>()) }
        }
    }
