package io.github.ffalt.jampacked.data

import io.github.ffalt.jampacked.data.auth.AuthRepository
import io.github.ffalt.jampacked.data.cache.QueryCache
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class NowPlayingRepository
    @Inject
    constructor(
        private val api: JamApi,
        private val auth: AuthRepository,
        private val cache: QueryCache
    ) {
        suspend fun scrobble(trackId: String) {
            val session = auth.session ?: return
            api
                .scrobble(session.server, session.token, trackId)
                .onSuccess {
                    cache.remove(QueryCache.cacheKey("HomeResult"))
                }
        }
    }
