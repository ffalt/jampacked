package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.cache.QueryCache
import io.github.ffalt.jampacked.data.cache.Resource
import io.github.ffalt.jampacked.graphql.HomeResultQuery
import kotlinx.coroutines.flow.Flow
import kotlinx.serialization.serializer
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class HomeRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider,
        private val cache: QueryCache
    ) {
        fun homeData(forceRefresh: Boolean = false): Flow<Resource<HomeData>> =
            cache.cachedQuery(
                key = QueryCache.cacheKey(OPERATION),
                serializer = serializer<HomeData>(),
                forceRefresh = forceRefresh
            ) {
                val response = apollo.client().query(HomeResultQuery()).execute()
                val data =
                    response.data
                        ?: throw IllegalStateException(
                            response.exception?.message
                                ?: response.errors?.firstOrNull()?.message
                                ?: "No data"
                        )
                transform(data)
            }

        suspend fun invalidate() = cache.remove(QueryCache.cacheKey(OPERATION))

        private fun transform(data: HomeResultQuery.Data): HomeData {
            val sections =
                HomeSections(
                    albumsRecent =
                        data.albumsRecent.items
                            .orEmpty()
                            .map { HomeEntry(it.id, it.name, ALBUM) },
                    artistsRecent =
                        data.artistsRecent.items
                            .orEmpty()
                            .map { HomeEntry(it.id, it.name, ARTIST) },
                    albumsFaved =
                        data.albumsFaved.items
                            .orEmpty()
                            .map { HomeEntry(it.id, it.name, ALBUM) },
                    artistsFaved =
                        data.artistsFaved.items
                            .orEmpty()
                            .map { HomeEntry(it.id, it.name, ARTIST) }
                )

            val stats = data.stats

            val library =
                listOf(
                    HomeStat("Artists", "artist", stats.artistTypes.album, "artists"),
                    HomeStat("Albums", "album", stats.albumTypes.album, "albums:album"),
                    HomeStat(
                        "Compilations",
                        "compilation",
                        stats.albumTypes.compilation,
                        "albums:compilation"
                    ),
                    HomeStat("Series", "series", stats.series, "series"),
                    HomeStat("Audiobooks", "audiobook", stats.albumTypes.audiobook, "albums:audiobook"),
                    HomeStat("Soundtracks", "soundtrack", stats.albumTypes.soundtrack, "albums:soundtrack"),
                    HomeStat("Live", "live", stats.albumTypes.live, "albums:live"),
                    HomeStat("Bootlegs", "bootleg", stats.albumTypes.bootleg, "albums:bootleg"),
                    HomeStat("EPs", "ep", stats.albumTypes.ep, "albums:ep"),
                    HomeStat("Singles", "single", stats.albumTypes.single, "albums:single"),
                    HomeStat("Folders", "folder", stats.folder, "folders"),
                    HomeStat("Tracks", "track", stats.track, "tracks"),
                    HomeStat("Genres", "genre", data.genres.total, "genres"),
                    HomeStat("Podcasts", "podcast", data.podcasts.total, "podcasts")
                ).filter { it.value > 0 }

            val user = data.currentUser.stats
            val collections =
                listOf(
                    HomeStat("Bookmarks", "bookmark", user.bookmark, "bookmarks"),
                    HomeStat("Playlists", "playlist", user.playlist, "playlists")
                ).filter { it.value > 0 }

            return HomeData(
                sections = sections,
                library = library,
                collections = collections,
                favorites =
                    sectionStats(
                        artists = user.favorite.artistTypes.album,
                        albums = user.favorite.albumTypes.album,
                        series = user.favorite.series,
                        folders = user.favorite.folder,
                        tracks = user.favorite.track,
                        listType = "faved"
                    ),
                played =
                    sectionStats(
                        artists = user.played.artistTypes.album,
                        albums = user.played.albumTypes.album,
                        series = user.played.series,
                        folders = user.played.folder,
                        tracks = user.played.track,
                        listType = "recent"
                    )
            )
        }

        private fun sectionStats(
            artists: Int,
            albums: Int,
            series: Int,
            folders: Int,
            tracks: Int,
            listType: String
        ): List<HomeStat> =
            listOf(
                HomeStat("Artists", "artist", artists, "artists:$listType"),
                HomeStat("Albums", "album", albums, "albums:album:$listType"),
                HomeStat("Series", "series", series, "series:$listType"),
                HomeStat("Folders", "folder", folders, "folders:$listType"),
                HomeStat("Tracks", "track", tracks, "tracks:$listType")
            ).filter { it.value > 0 }

        private companion object {
            const val OPERATION = "HomeResult"
            const val ALBUM = "album"
            const val ARTIST = "artist"
        }
    }
