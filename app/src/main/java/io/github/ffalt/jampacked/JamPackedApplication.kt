package io.github.ffalt.jampacked

import android.app.Application
import androidx.annotation.OptIn
import androidx.media3.common.util.UnstableApi
import coil3.ImageLoader
import coil3.PlatformContext
import coil3.SingletonImageLoader
import coil3.network.okhttp.OkHttpNetworkFetcherFactory
import dagger.hilt.android.HiltAndroidApp
import io.github.ffalt.jampacked.data.DownloadRulesRepository
import io.github.ffalt.jampacked.data.StreamSettingsRepository
import io.github.ffalt.jampacked.data.ThemeRepository
import io.github.ffalt.jampacked.data.auth.AuthRepository
import io.github.ffalt.jampacked.util.CrashLog
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import javax.inject.Inject

@UnstableApi
@HiltAndroidApp
class JamPackedApplication :
    Application(),
    SingletonImageLoader.Factory {
    @Inject
    lateinit var auth: AuthRepository

    @Inject
    lateinit var themes: ThemeRepository

    @Inject
    lateinit var streamSettings: StreamSettingsRepository

    @OptIn(UnstableApi::class)
    @Inject
    lateinit var downloadRules: DownloadRulesRepository

    @Inject
    lateinit var httpClient: OkHttpClient

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    @OptIn(UnstableApi::class)
    override fun onCreate() {
        super.onCreate()
        CrashLog.install(this)

        scope.launch {
            auth.load()
            themes.load()
            streamSettings.load()
            downloadRules.load()
            auth.check()
        }
    }

    override fun newImageLoader(context: PlatformContext): ImageLoader =
        ImageLoader
            .Builder(context)
            .components {
                add(OkHttpNetworkFetcherFactory(callFactory = { httpClient }))
            }.build()
}
