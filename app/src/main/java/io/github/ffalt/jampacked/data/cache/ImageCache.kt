package io.github.ffalt.jampacked.data.cache

import android.content.Context
import coil3.SingletonImageLoader
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

interface ImageCache {
    val epoch: StateFlow<Long>
    suspend fun clear()
}

@Singleton
class CoilImageCache
    @Inject
    constructor(
        @ApplicationContext private val context: Context
    ) : ImageCache {
    private val _epoch = MutableStateFlow(0L)
    override val epoch: StateFlow<Long> = _epoch.asStateFlow()

    override suspend fun clear() {
        withContext(Dispatchers.IO) {
            runCatching {
                val imageLoader = SingletonImageLoader.get(context)
                imageLoader.memoryCache?.clear()
                imageLoader.diskCache?.clear()
            }
            runCatching {
                context.cacheDir.resolve("image_cache").deleteRecursively()
                context.cacheDir.resolve("image_cache_v2").deleteRecursively()
                context.cacheDir.resolve("coil_cache").deleteRecursively()
                context.externalCacheDir?.resolve("image_cache")?.deleteRecursively()
                context.externalCacheDir?.resolve("coil_cache")?.deleteRecursively()
            }
            _epoch.value = System.currentTimeMillis()
        }
    }
}
