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
    val epochs: StateFlow<Map<String, Long>>
    suspend fun clear()
    fun refresh(id: String)
}

@Singleton
class CoilImageCache
    @Inject
    constructor(
        @ApplicationContext private val context: Context
    ) : ImageCache {
    private val _epochs = MutableStateFlow<Map<String, Long>>(emptyMap())
    override val epochs: StateFlow<Map<String, Long>> = _epochs.asStateFlow()

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
            _epochs.value = emptyMap()
        }
    }

    override fun refresh(id: String) {
        val ts = System.currentTimeMillis()
        _epochs.value = _epochs.value.toMutableMap().also { it[id] = ts }
    }
}
