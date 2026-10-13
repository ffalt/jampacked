package io.github.ffalt.jampacked.data.auth

import android.content.Context
import android.content.SharedPreferences
import androidx.core.content.edit
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.data.JamSession
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class EncryptedAuthStore
    @Inject
    constructor(
        @ApplicationContext private val context: Context,
        private val json: Json
    ) : AuthStore {
        private val prefs: SharedPreferences by lazy {
            context.getSharedPreferences(FILE_NAME, Context.MODE_PRIVATE)
        }

        override fun load(): JamSession? {
            val raw = runCatching { prefs.getString(KEY_SESSION, null) }.getOrNull() ?: return null
            return runCatching { json.decodeFromString<JamSession>(raw) }.getOrNull()
        }

        override fun save(session: JamSession) {
            runCatching {
                prefs.edit { putString(KEY_SESSION, json.encodeToString(session)) }
            }
        }

        override fun clear() {
            runCatching { prefs.edit { remove(KEY_SESSION) } }
        }

        private companion object {
            const val FILE_NAME = "jam_session"
            const val KEY_SESSION = "session"
        }
    }
