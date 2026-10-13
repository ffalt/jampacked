package io.github.ffalt.jampacked.data.cache

import io.github.ffalt.jampacked.data.db.CacheDao
import io.github.ffalt.jampacked.data.db.CacheRow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class RoomCacheStore
    @Inject
    constructor(
        private val dao: CacheDao
    ) : CacheStore {
        override suspend fun find(key: String): CachedDocument? =
            dao.find(key)?.let { CachedDocument(it.key, it.data, it.date, it.version) }

        override suspend fun put(document: CachedDocument) {
            dao.delete(document.key)
            dao.insert(
                CacheRow(
                    key = document.key,
                    data = document.data,
                    date = document.date,
                    version = document.version
                )
            )
        }

        override suspend fun remove(key: String) = dao.delete(key)

        override suspend fun removeStartingWith(prefix: String) {
            if (prefix.isEmpty()) return
            dao.deleteStartingWith(prefix)
        }

        override suspend fun clear() = dao.clear()
    }
