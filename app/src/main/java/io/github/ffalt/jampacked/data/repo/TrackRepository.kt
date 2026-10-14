package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.data.cache.QueryCache
import io.github.ffalt.jampacked.graphql.TrackResultQuery
import kotlinx.serialization.serializer
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TrackRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider,
        private val cache: QueryCache
    ) {
        suspend fun track(
            id: String,
            forceRefresh: Boolean = false
        ): Result<TrackEntry> =
            runCatching {
                val key = QueryCache.cacheKey("TrackResult", id)
                if (!forceRefresh) {
                    cache.read(key, serializer<TrackEntry>())?.let { return@runCatching it }
                }
                val response = apollo.client().query(TrackResultQuery(id)).execute()
                val track =
                    response.data?.track
                        ?: throw IllegalStateException(response.exception?.message ?: "Track not found")

                val entry =
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
                        seriesID = track.series?.id,
                        mediaFormat = track.tag?.mediaFormat?.rawValue
                    )
                cache.write(key, entry, serializer<TrackEntry>())
                entry
            }
    }
