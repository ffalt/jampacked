package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.cache.QueryCache
import io.github.ffalt.jampacked.graphql.FolderIndexResultQuery
import io.github.ffalt.jampacked.graphql.FolderListResultQuery
import io.github.ffalt.jampacked.graphql.FolderResultQuery
import io.github.ffalt.jampacked.graphql.TrackListResultQuery
import kotlinx.serialization.Serializable
import kotlinx.serialization.serializer
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class FolderDetail(
    val id: String,
    val title: String,
    val folderType: String?,
    val artist: String?,
    val folderCount: Int,
    val trackCount: Int,
    val genres: List<String> = emptyList(),
    val children: List<BrowseEntry> = emptyList(),
    val tracks: List<TrackEntry> = emptyList()
)

@Singleton
class FolderRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider,
        private val cache: QueryCache
    ) {
        suspend fun index(forceRefresh: Boolean = false): Result<BrowseIndex> =
            runCatching {
                val key = QueryCache.cacheKey("FolderIndexResult")
                if (!forceRefresh) cache.read(key, serializer<BrowseIndex>())?.let { return@runCatching it }

                val response = apollo.client().query(FolderIndexResultQuery(level = null)).execute()
                val groups =
                    response.data?.folderIndex?.groups.orEmpty().map { group ->
                        BrowseIndexGroup(
                            letter = group.name,
                            items =
                                group.items.map {
                                    BrowseEntry(
                                        it.id,
                                        it.name,
                                        folderDescription(it.folderType.rawValue, it.tracksCount, it.childrenCount),
                                        "folder"
                                    )
                                }
                        )
                    }
                BrowseIndex(groups).also { cache.write(key, it, serializer<BrowseIndex>()) }
            }

        suspend fun list(
            listType: String?,
            skip: Int,
            take: Int
        ): Result<BrowsePage> =
            runCatching {
                val response =
                    apollo
                        .client()
                        .query(
                            FolderListResultQuery(
                                listType = listType?.toListType(),
                                seed = null,
                                albumTypes = null,
                                genreIDs = null,
                                take = take,
                                skip = skip
                            )
                        ).execute()
                val folders =
                    response.data?.folders
                        ?: throw IllegalStateException(response.exception?.message ?: "No data")
                BrowsePage(
                    items =
                        folders.items.map {
                            BrowseEntry(
                                it.id,
                                it.name,
                                folderDescription(it.folderType.rawValue, it.tracksCount, it.childrenCount),
                                "folder"
                            )
                        },
                    total = folders.total,
                    skip = folders.skip ?: skip,
                    take = folders.take ?: take
                )
            }

        suspend fun folder(
            id: String,
            forceRefresh: Boolean = false
        ): Result<FolderDetail> =
            runCatching {
                val key = QueryCache.cacheKey("FolderResult", id)
                if (!forceRefresh) {
                    cache
                        .read(key, serializer<FolderDetail>())
                        ?.let { return@runCatching it }
                }

                val folder =
                    apollo
                        .client()
                        .query(FolderResultQuery(id))
                        .execute()
                        .data
                        ?.folder
                        ?: throw IllegalStateException("Folder not found")

                FolderDetail(
                    id = folder.id,
                    title = folder.title.orEmpty(),
                    folderType = folder.folderType.rawValue,
                    artist = folder.artist,
                    folderCount = folder.childrenCount,
                    trackCount = folder.tracksCount,
                    genres = folder.genres.orEmpty().map { it.name },
                    children =
                        folder.children.orEmpty().map {
                            BrowseEntry(
                                it.id,
                                it.title.orEmpty(),
                                it.folderType.rawValue.orEmpty(),
                                "folder"
                            )
                        },
                    tracks =
                        folder.tracks.orEmpty().map { track ->
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
                ).also { cache.write(key, it, serializer<FolderDetail>()) }
            }

        suspend fun trackList(
            listType: String?,
            skip: Int,
            take: Int,
            genreId: String? = null
        ): Result<Pair<List<TrackEntry>, Int>> =
            runCatching {
                val response =
                    apollo
                        .client()
                        .query(
                            TrackListResultQuery(
                                listType = listType?.toListType(),
                                genreIDs = genreId?.let { listOf(it) },
                                seed = null,
                                take = take,
                                skip = skip
                            )
                        ).execute()
                val tracks =
                    response.data?.tracks
                        ?: throw IllegalStateException(response.exception?.message ?: "No data")
                val items =
                    tracks.items.map { track ->
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
                items to tracks.total
            }
    }

private fun folderDescription(
    folderType: String?,
    tracks: Int,
    children: Int
): String =
    listOfNotNull(
        folderType,
        tracks.takeIf { it > 0 }?.let { "$it tracks" },
        children.takeIf { it > 0 }?.let { "$it folders" }
    ).joinToString(" / ")
