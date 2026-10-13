package io.github.ffalt.jampacked.data

import com.apollographql.apollo.ApolloClient
import io.github.ffalt.jampacked.data.auth.AuthRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ApolloProvider
    @Inject
    constructor(
        private val auth: AuthRepository
    ) {
        private var cached: ApolloClient? = null
        private var cachedFor: JamSession? = null

        @Synchronized
        fun client(): ApolloClient {
            val session = auth.session ?: error("Not logged in")
            val existing = cached
            if (existing != null && cachedFor == session) return existing
            existing?.close()
            return ApolloClient
                .Builder()
                .serverUrl(session.graphqlUrl)
                .addHttpHeader("Authorization", "Bearer ${session.token}")
                .build()
                .also {
                    cached = it
                    cachedFor = session
                }
        }

        @Synchronized
        fun close() {
            cached?.close()
            cached = null
            cachedFor = null
        }
    }
