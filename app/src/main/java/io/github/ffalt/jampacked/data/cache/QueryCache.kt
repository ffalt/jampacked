package io.github.ffalt.jampacked.data.cache

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.serialization.KSerializer
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

sealed interface Resource<out T> {
    data object Loading : Resource<Nothing>

    data class Success<T>(
        val data: T,
        val fromCache: Boolean
    ) : Resource<T>

    data class Failure(
        val error: Throwable
    ) : Resource<Nothing>
}

@Singleton
class QueryCache
    @Inject
    constructor(
        private val store: CacheStore,
        private val json: Json
    ) {
        internal var now: () -> Long = System::currentTimeMillis

        suspend fun <T> read(
            key: String,
            serializer: KSerializer<T>
        ): T? {
            val document = store.find(key) ?: return null
            if (document.version != CURRENT_VERSION) return null
            return runCatching { json.decodeFromString(serializer, document.data) }.getOrNull()
        }

        suspend fun <T> write(
            key: String,
            value: T,
            serializer: KSerializer<T>
        ) {
            val encoded = runCatching { json.encodeToString(serializer, value) }.getOrNull() ?: return
            store.put(
                CachedDocument(
                    key = key,
                    data = encoded,
                    date = now(),
                    version = CURRENT_VERSION
                )
            )
        }

        suspend fun remove(key: String) = store.remove(key)

        suspend fun removeStartingWith(prefix: String) = store.removeStartingWith(prefix)

        suspend fun clear() = store.clear()

        fun <T> cachedQuery(
            key: String,
            serializer: KSerializer<T>,
            forceRefresh: Boolean = false,
            fetch: suspend () -> T
        ): Flow<Resource<T>> =
            flow {
                emit(Resource.Loading)
                if (!forceRefresh) {
                    val cached = read(key, serializer)
                    if (cached != null) {
                        emit(Resource.Success(cached, fromCache = true))
                        return@flow
                    }
                }
                val result = runCatching { fetch() }
                result.fold(
                    onSuccess = { value ->
                        write(key, value, serializer)
                        emit(Resource.Success(value, fromCache = false))
                    },
                    onFailure = { error -> emit(Resource.Failure(error)) }
                )
            }

        companion object {
            // TrackEntry gained mediaFormat; older rows decode null and fall back to mp3.
            // PodcastDetail gained the feed facts the about section shows.
            const val CURRENT_VERSION = 5

            fun cacheKey(
                operationName: String,
                variables: String? = null
            ): String = operationName + (variables ?: "")
        }
    }
