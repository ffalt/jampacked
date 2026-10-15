package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.cache.QueryCache
import io.github.ffalt.jampacked.graphql.ArtistIndexResultQuery
import io.github.ffalt.jampacked.graphql.ArtistListResultQuery
import io.github.ffalt.jampacked.graphql.ArtistResultQuery
import kotlinx.serialization.serializer
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ArtistRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider,
        private val cache: QueryCache
    ) {
        suspend fun index(forceRefresh: Boolean = false): Result<BrowseIndex> =
            runCatching {
                val key = QueryCache.cacheKey("ArtistIndexResult")
                if (!forceRefresh) cache.read(key, serializer<BrowseIndex>())?.let { return@runCatching it }

                val response =
                    apollo
                        .client()
                        .query(ArtistIndexResultQuery(albumTypes = listOf("album".toAlbumType())))
                        .execute()
                val groups =
                    response.data?.artistIndex?.groups.orEmpty().map { group ->
                        BrowseIndexGroup(
                            letter = group.name,
                            items =
                                group.items.map {
                                    BrowseEntry(it.id, it.name, albumCountLabel(it.albumsCount), "artist")
                                }
                        )
                    }
                BrowseIndex(groups).also { cache.write(key, it, serializer<BrowseIndex>()) }
            }

        suspend fun list(
            listType: String?,
            skip: Int,
            take: Int,
            genreId: String? = null,
            albumType: String? = "album",
            sort: BrowseSort = BrowseSort()
        ): Result<BrowsePage> =
            runCatching {
                val response =
                    apollo
                        .client()
                        .query(
                            ArtistListResultQuery(
                                listType = listType?.toListType(),
                                seed = null,
                                albumTypes = albumType?.let { listOf(it.toAlbumType()) },
                                genreIDs = genreId?.let { listOf(it) },
                                order = sort.artistOrder(),
                                take = take,
                                skip = skip
                            )
                        ).execute()
                val artists =
                    response.data?.artists
                        ?: throw IllegalStateException(response.exception?.message ?: "No data")
                BrowsePage(
                    items =
                        artists.items.map {
                            BrowseEntry(it.id, it.name, albumCountLabel(it.albumsCount), "artist")
                        },
                    total = artists.total,
                    skip = artists.skip ?: skip,
                    take = artists.take ?: take
                )
            }

        suspend fun artist(
            id: String,
            forceRefresh: Boolean = false
        ): Result<ArtistDetail> =
            runCatching {
                val key = QueryCache.cacheKey("ArtistResult", id)
                if (!forceRefresh) {
                    cache
                        .read(key, serializer<ArtistDetail>())
                        ?.let { return@runCatching it }
                }

                val artist =
                    apollo
                        .client()
                        .query(ArtistResultQuery(id))
                        .execute()
                        .data
                        ?.artist
                        ?: throw IllegalStateException("Artist not found")

                val albums = artist.albums.orEmpty()
                val albumEntries =
                    albums.map { album ->
                        BrowseEntry(
                            id = album.id,
                            title = album.name,
                            description = albumEntryDescription(album.seriesNr, album.year),
                            kind = "album",
                            year = album.year
                        )
                    }
                val albumTypes = albums.map { it.albumType.rawValue }

                ArtistDetail(
                    id = artist.id,
                    name = artist.name,
                    albumCount = artist.albumsCount,
                    trackCount = artist.tracksCount,
                    genres = artist.genres.orEmpty().map { it.name },
                    genreId =
                        artist.genres
                            .orEmpty()
                            .firstOrNull()
                            ?.id,
                    albums = albumEntries,
                    sections = browseSections(albumEntries, albumTypes)
                ).also { cache.write(key, it, serializer<ArtistDetail>()) }
            }
    }

private fun albumCountLabel(count: Int): String = if (count == 1) "1 album" else "$count albums"
