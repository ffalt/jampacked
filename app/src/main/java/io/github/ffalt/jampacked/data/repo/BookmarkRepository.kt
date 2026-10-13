package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.TrackEntry
import io.github.ffalt.jampacked.graphql.BookmarkResultQuery
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BookmarkRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider
    ) {
        suspend fun bookmarks(
            take: Int = 20,
            skip: Int = 0
        ): Result<List<TrackEntry>> =
            runCatching {
                val response =
                    apollo
                        .client()
                        .query(
                            BookmarkResultQuery(
                                take = take,
                                skip = skip,
                                ids = null,
                                trackIDs = null,
                                episodeIDs = null,
                                userIDs = null
                            )
                        ).execute()
                val items =
                    response.data?.bookmarks?.items
                        ?: throw IllegalStateException(response.exception?.message ?: "No data")

                items.mapNotNull { bookmark ->
                    bookmark.track?.let { track ->
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
                    } ?: bookmark.episode?.let { episode ->
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
            }
    }
