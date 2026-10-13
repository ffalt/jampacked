package io.github.ffalt.jampacked

import android.app.Application
import coil3.ImageLoader
import coil3.PlatformContext
import coil3.SingletonImageLoader
import coil3.network.okhttp.OkHttpNetworkFetcherFactory
import dagger.hilt.android.HiltAndroidApp
import io.github.ffalt.jampacked.data.ThemeRepository
import io.github.ffalt.jampacked.data.auth.AuthRepository
import io.github.ffalt.jampacked.util.CrashLog
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import okhttp3.OkHttpClient
import javax.inject.Inject

@HiltAndroidApp
class JamPackedApplication :
    Application(),
    SingletonImageLoader.Factory {
    @Inject
    lateinit var auth: AuthRepository

    @Inject
    lateinit var themes: ThemeRepository

    @Inject
    lateinit var httpClient: OkHttpClient

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

    override fun onCreate() {
        super.onCreate()
        CrashLog.install(this)

        scope.launch {
            auth.load()
            themes.load()
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
