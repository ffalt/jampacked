package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.graphql.SearchAlbumsResultQuery
import io.github.ffalt.jampacked.graphql.SearchArtistsResultQuery
import io.github.ffalt.jampacked.graphql.SearchFoldersResultQuery
import io.github.ffalt.jampacked.graphql.SearchPlaylistsResultQuery
import io.github.ffalt.jampacked.graphql.SearchSeriesResultQuery
import io.github.ffalt.jampacked.graphql.SearchTracksResultQuery
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import javax.inject.Inject
import javax.inject.Singleton

data class SearchHit(
    val id: String,
    val name: String,
    val detail: String,
    val kind: String
)

data class SearchResults(
    val artists: List<SearchHit> = emptyList(),
    val albums: List<SearchHit> = emptyList(),
    val tracks: List<SearchHit> = emptyList(),
    val folders: List<SearchHit> = emptyList(),
    val series: List<SearchHit> = emptyList(),
    val playlists: List<SearchHit> = emptyList()
) {
    val isEmpty: Boolean
        get() =
            artists.isEmpty() && albums.isEmpty() && tracks.isEmpty() &&
                folders.isEmpty() && series.isEmpty() && playlists.isEmpty()
}

@Singleton
class SearchRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider
    ) {
        data class Page(
            val hits: List<SearchHit>,
            val total: Int
        )

        suspend fun search(
            query: String,
            take: Int = QUICK_TAKE
        ): Result<SearchResults> =
            runCatching {
                coroutineScope {
                    val kinds =
                        KINDS.associateWith { kind -> async { page(query, kind, take, 0).hits } }
                    SearchResults(
                        artists = kinds.getValue("artist").await(),
                        albums = kinds.getValue("album").await(),
                        tracks = kinds.getValue("track").await(),
                        folders = kinds.getValue("folder").await(),
                        series = kinds.getValue("series").await(),
                        playlists = kinds.getValue("playlist").await()
                    )
                }
            }

        suspend fun searchKind(
            query: String,
            kind: String,
            take: Int,
            skip: Int
        ): Result<Page> = runCatching { page(query, kind, take, skip) }

        private suspend fun page(
            query: String,
            kind: String,
            take: Int,
            skip: Int
        ): Page {
            val client = apollo.client()
            return when (kind) {
                "artist" -> {
                    client
                        .query(SearchArtistsResultQuery(query, take, skip))
                        .execute()
                        .data
                        ?.artists
                        .let {
                            Page(
                                it
                                    ?.items
                                    .orEmpty()
                                    .map { a -> SearchHit(a.id, a.name, "${a.albumsCount} albums", kind) },
                                it?.total ?: 0
                            )
                        }
                }

                "album" -> {
                    client
                        .query(SearchAlbumsResultQuery(query, take, skip))
                        .execute()
                        .data
                        ?.albums
                        .let {
                            Page(
                                it
                                    ?.items
                                    .orEmpty()
                                    .map { a -> SearchHit(a.id, a.name, a.artist.name.orEmpty(), kind) },
                                it?.total ?: 0
                            )
                        }
                }

                "track" -> {
                    client
                        .query(SearchTracksResultQuery(query, take, skip))
                        .execute()
                        .data
                        ?.tracks
                        .let {
                            Page(
                                it
                                    ?.items
                                    .orEmpty()
                                    .map { t -> SearchHit(t.id, t.name, t.tag?.artist.orEmpty(), kind) },
                                it?.total ?: 0
                            )
                        }
                }

                "folder" -> {
                    client
                        .query(SearchFoldersResultQuery(query, take, skip))
                        .execute()
                        .data
                        ?.folders
                        .let {
                            Page(
                                it
                                    ?.items
                                    .orEmpty()
                                    .map { f -> SearchHit(f.id, f.name, "${f.tracksCount} tracks", kind) },
                                it?.total ?: 0
                            )
                        }
                }

                "series" -> {
                    client
                        .query(SearchSeriesResultQuery(query, take, skip))
                        .execute()
                        .data
                        ?.serieses
                        .let {
                            Page(
                                it
                                    ?.items
                                    .orEmpty()
                                    .map { x -> SearchHit(x.id, x.name, "${x.albumsCount} albums", kind) },
                                it?.total ?: 0
                            )
                        }
                }

                "playlist" -> {
                    client
                        .query(SearchPlaylistsResultQuery(query, take, skip))
                        .execute()
                        .data
                        ?.playlists
                        .let {
                            Page(
                                it
                                    ?.items
                                    .orEmpty()
                                    .map { p ->
                                        SearchHit(
                                            p.id,
                                            p.name,
                                            "${p.entriesCount} entries",
                                            kind
                                        )
                                    },
                                it?.total ?: 0
                            )
                        }
                }

                else -> {
                    Page(emptyList(), 0)
                }
            }
        }

        companion object {
            val KINDS = listOf("artist", "album", "track", "folder", "series", "playlist")

            const val QUICK_TAKE = 5

            const val PAGE_TAKE = 20
        }
    }
