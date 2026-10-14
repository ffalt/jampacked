package io.github.ffalt.jampacked.ui.settings

import androidx.annotation.OptIn
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.media3.common.util.UnstableApi
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.DownloadRulesRepository
import io.github.ffalt.jampacked.data.PinRepository
import io.github.ffalt.jampacked.data.StreamOptions
import io.github.ffalt.jampacked.data.StreamSettings
import io.github.ffalt.jampacked.data.StreamSettingsRepository
import io.github.ffalt.jampacked.data.ThemeRepository
import io.github.ffalt.jampacked.data.UserRoles
import io.github.ffalt.jampacked.data.auth.AuthRepository
import io.github.ffalt.jampacked.data.cache.QueryCache
import io.github.ffalt.jampacked.ui.theme.JamThemeName
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class CacheStats(
    val pinnedObjects: Int = 0,
    val downloadedFiles: Int = 0,
    val downloadedBytes: Long = 0
)

@HiltViewModel
class SettingsViewModel
    @OptIn(UnstableApi::class)
    @Inject
    constructor(
        private val themes: ThemeRepository,
        private val auth: AuthRepository,
        private val cache: QueryCache,
        private val apollo: ApolloProvider,
        private val pins: PinRepository,
        private val streams: StreamSettingsRepository,
        private val downloadRules: DownloadRulesRepository
    ) : ViewModel() {
        val theme: StateFlow<JamThemeName> = themes.theme
        val playableFormats: String get() = streams.playableFormats.sorted().joinToString { it.uppercase() }
        val streamSettings: StateFlow<StreamSettings> = streams.state
        val unmeteredOnly: StateFlow<Boolean> = downloadRules.unmeteredOnly
        val userName: String get() = auth.session?.userName.orEmpty()
        val userId: String get() = auth.session?.userId.orEmpty()
        val roles: UserRoles get() = auth.session?.roles ?: UserRoles()

        private val _cacheStats = MutableStateFlow(CacheStats())
        val cacheStats: StateFlow<CacheStats> = _cacheStats.asStateFlow()

        init {
            refreshCacheStats()
        }

        @OptIn(UnstableApi::class)
        fun refreshCacheStats() {
            viewModelScope.launch {
                val stat = pins.stat()
                _cacheStats.value =
                    CacheStats(
                        pinnedObjects = pins.count(),
                        downloadedFiles = stat.files,
                        downloadedBytes = stat.bytes
                    )
            }
        }

        fun setTheme(name: JamThemeName) {
            viewModelScope.launch { themes.set(name) }
        }

        fun setUnmeteredOnly(enabled: Boolean) {
            viewModelScope.launch { downloadRules.set(enabled) }
        }

        fun setStreaming(options: StreamOptions) {
            viewModelScope.launch { streams.setStreaming(options) }
        }

        fun setDownloads(options: StreamOptions) {
            viewModelScope.launch { streams.setDownloads(options) }
        }

        fun clearCache() {
            viewModelScope.launch {
                cache.clear()
                refreshCacheStats()
            }
        }

        @OptIn(UnstableApi::class)
        fun clearDownloads() {
            viewModelScope.launch {
                pins.clear()
                refreshCacheStats()
            }
        }

        fun logout() {
            apollo.close()
            auth.logout()
        }
    }
