package io.github.ffalt.jampacked.data.cache

class FakeCacheStore : CacheStore {
    val rows = mutableMapOf<String, CachedDocument>()
    var findCount = 0
    var putCount = 0

    override suspend fun find(key: String): CachedDocument? {
        findCount++
        return rows[key]
    }

    override suspend fun put(document: CachedDocument) {
        putCount++
        rows[document.key] = document
    }

    override suspend fun remove(key: String) {
        rows.remove(key)
    }

    override suspend fun removeStartingWith(prefix: String) {
        if (prefix.isEmpty()) return
        rows.keys.filter { it.startsWith(prefix) }.forEach { rows.remove(it) }
    }

    override suspend fun clear() = rows.clear()
}
