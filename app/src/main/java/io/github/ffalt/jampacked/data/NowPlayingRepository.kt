package io.github.ffalt.jampacked.data

import io.github.ffalt.jampacked.data.cache.QueryCache
import io.github.ffalt.jampacked.graphql.ScrobbleResultMutation
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class NowPlayingRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider,
        private val cache: QueryCache
    ) {
        suspend fun scrobble(trackId: String) {
            runCatching {
                apollo
                    .client()
                    .mutation(ScrobbleResultMutation(trackId))
                    .execute()
                    .dataOrThrow()
            }.onSuccess {
                cache.remove(QueryCache.cacheKey("HomeResult"))
            }
        }
    }
