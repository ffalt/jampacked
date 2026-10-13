package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.cache.QueryCache
import io.github.ffalt.jampacked.graphql.AlbumIndexResultQuery
import io.github.ffalt.jampacked.graphql.AlbumListResultQuery
import io.github.ffalt.jampacked.graphql.AlbumResultQuery
import io.github.ffalt.jampacked.graphql.type.AlbumType
import io.github.ffalt.jampacked.graphql.type.ListType
import kotlinx.serialization.serializer
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AlbumRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider,
        private val cache: QueryCache
    ) {
        suspend fun index(
            albumType: String,
            forceRefresh: Boolean = false
        ): Result<BrowseIndex> =
            runCatching {
                val key = QueryCache.cacheKey("AlbumIndexResult", albumType)
                if (!forceRefresh) {
                    cache
                        .read(key, serializer<BrowseIndex>())
                        ?.let { return@runCatching it }
                }

                val response =
                    apollo
                        .client()
                        .query(AlbumIndexResultQuery(albumTypes = listOf(albumType.toAlbumType())))
                        .execute()
                val groups =
                    response.data?.albumIndex?.groups.orEmpty().map { group ->
                        BrowseIndexGroup(
                            letter = group.name,
                            items =
                                group.items.map {
                                    BrowseEntry(it.id, it.name, it.artist.name.orEmpty(), "album")
                                }
                        )
                    }
                BrowseIndex(groups).also { cache.write(key, it, serializer<BrowseIndex>()) }
            }

        suspend fun list(
            albumType: String?,
            listType: String?,
            skip: Int,
            take: Int,
            genreId: String? = null
        ): Result<BrowsePage> =
            runCatching {
                val response =
                    apollo
                        .client()
                        .query(
                            AlbumListResultQuery(
                                listType = listType?.toListType(),
                                seed = null,
                                albumTypes = albumType?.let { listOf(it.toAlbumType()) },
                                genreIDs = genreId?.let { listOf(it) },
                                take = take,
                                skip = skip
                            )
                        ).execute()
                val albums =
                    response.data?.albums
                        ?: throw IllegalStateException(response.exception?.message ?: "No data")
                BrowsePage(
                    items =
                        albums.items.map {
                            BrowseEntry(it.id, it.name, it.artist.name.orEmpty(), "album")
                        },
                    total = albums.total,
                    skip = albums.skip ?: skip,
                    take = albums.take ?: take
                )
            }

        suspend fun album(
            id: String,
            forceRefresh: Boolean = false
        ): Result<AlbumDetail> =
            runCatching {
                val key = QueryCache.cacheKey("AlbumResult", id)
                if (!forceRefresh) {
                    cache
                        .read(key, serializer<AlbumDetail>())
                        ?.let { return@runCatching it }
                }

                val album =
                    apollo
                        .client()
                        .query(AlbumResultQuery(id))
                        .execute()
                        .data
                        ?.album
                        ?: throw IllegalStateException("Album not found")

                AlbumDetail(
                    id = album.id,
                    name = album.name,
                    albumType = album.albumType.rawValue,
                    artist = album.artist.name.orEmpty(),
                    artistId = album.artist.id,
                    trackCount = album.tracksCount,
                    genres = album.genres.orEmpty().map { it.name },
                    genreId =
                        album.genres
                            .orEmpty()
                            .firstOrNull()
                            ?.id,
                    tracks =
                        album.tracks.orEmpty().map { track ->
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
                                genre = track.genres.firstOrNull()?.name,
                                albumID = track.album?.id,
                                artistID = track.artist?.id,
                                seriesID = track.series?.id
                            )
                        }
                ).also { cache.write(key, it, serializer<AlbumDetail>()) }
            }
    }

internal fun String.toAlbumType(): AlbumType = AlbumType.entries.firstOrNull { it.rawValue == this } ?: AlbumType.album

internal fun String.toListType(): ListType? = ListType.entries.firstOrNull { it.rawValue == this }
