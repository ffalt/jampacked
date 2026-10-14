package io.github.ffalt.jampacked.data

import androidx.media3.common.util.UnstableApi
import io.github.ffalt.jampacked.player.Downloads
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@UnstableApi
@Singleton
class DownloadRulesRepository
    @Inject
    constructor(
        private val store: SettingsRepository,
        private val downloads: Downloads
    ) {
        private val _unmeteredOnly = MutableStateFlow(false)
        val unmeteredOnly: StateFlow<Boolean> = _unmeteredOnly.asStateFlow()

        suspend fun load() {
            apply(store.getSetting(KEY).toBoolean())
        }

        suspend fun set(unmeteredOnly: Boolean) {
            apply(unmeteredOnly)
            store.setSetting(KEY, unmeteredOnly.toString())
        }

        private fun apply(unmeteredOnly: Boolean) {
            _unmeteredOnly.value = unmeteredOnly
            downloads.setUnmeteredOnly(unmeteredOnly)
        }

        private companion object {
            const val KEY = "downloads_unmetered_only"
        }
    }
