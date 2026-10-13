package io.github.ffalt.jampacked.data

import io.github.ffalt.jampacked.data.auth.AuthRepository
import io.github.ffalt.jampacked.data.db.StoreDao
import io.github.ffalt.jampacked.data.db.StoreRow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SettingsRepository
    @Inject
    constructor(
        private val dao: StoreDao,
        private val auth: AuthRepository
    ) {
        suspend fun getSetting(key: String): String? = getValue(userKey(key))

        suspend fun setSetting(
            key: String,
            value: String?
        ) = setValue(userKey(key), value)

        private fun userKey(key: String): String = "jam:${auth.session?.userId.orEmpty()}:$key"

        private suspend fun getValue(id: String): String? = dao.find(id)?.data

        private suspend fun setValue(
            id: String,
            value: String?
        ) {
            dao.delete(id)
            if (value != null) {
                dao.insert(
                    StoreRow(
                        key = id,
                        data = value,
                        date = System.currentTimeMillis(),
                        version = VERSION
                    )
                )
            }
        }

        private companion object {
            const val VERSION = 1
        }
    }
