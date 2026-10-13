package io.github.ffalt.jampacked.data.cache

data class CachedDocument(
    val key: String,
    val data: String,
    val date: Long,
    val version: Int
)

interface CacheStore {
    suspend fun find(key: String): CachedDocument?

    suspend fun put(document: CachedDocument)

    suspend fun remove(key: String)

    suspend fun removeStartingWith(prefix: String)

    suspend fun clear()
}
