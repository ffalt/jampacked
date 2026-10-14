package io.github.ffalt.jampacked.player

import android.content.Context
import androidx.media3.common.util.UnstableApi
import androidx.media3.database.DatabaseProvider
import androidx.media3.database.StandaloneDatabaseProvider
import androidx.media3.datasource.DataSource
import androidx.media3.datasource.DefaultDataSource
import androidx.media3.datasource.cache.Cache
import androidx.media3.datasource.cache.CacheDataSource
import androidx.media3.datasource.cache.NoOpCacheEvictor
import androidx.media3.datasource.cache.SimpleCache
import androidx.media3.datasource.okhttp.OkHttpDataSource
import androidx.media3.exoplayer.offline.DownloadManager
import androidx.media3.exoplayer.offline.DownloadNotificationHelper
import androidx.media3.exoplayer.scheduler.Requirements
import dagger.hilt.android.qualifiers.ApplicationContext
import okhttp3.OkHttpClient
import java.io.File
import java.util.concurrent.Executors
import javax.inject.Inject
import javax.inject.Singleton

@UnstableApi
@Singleton
class Downloads
    @Inject
    constructor(
        @ApplicationContext private val context: Context,
        private val http: OkHttpClient
    ) {
        private val databaseProvider: DatabaseProvider by lazy { StandaloneDatabaseProvider(context) }

        private val downloadDirectory: File by lazy {
            File(context.getExternalFilesDir(null) ?: context.filesDir, DOWNLOAD_CONTENT_DIRECTORY)
        }

        val cache: Cache by lazy {
            SimpleCache(downloadDirectory, NoOpCacheEvictor(), databaseProvider)
        }

        private val httpDataSourceFactory: OkHttpDataSource.Factory by lazy {
            OkHttpDataSource.Factory(http)
        }

        val downloadManager: DownloadManager by lazy {
            DownloadManager(
                context,
                databaseProvider,
                cache,
                httpDataSourceFactory,
                Executors.newFixedThreadPool(DOWNLOAD_THREADS)
            ).apply {

                resumeDownloads()
            }
        }

        val notificationHelper: DownloadNotificationHelper by lazy {
            DownloadNotificationHelper(context, DOWNLOAD_CHANNEL_ID)
        }

        fun setUnmeteredOnly(unmeteredOnly: Boolean) {
            downloadManager.requirements =
                if (unmeteredOnly) UNMETERED_REQUIREMENTS else DownloadManager.DEFAULT_REQUIREMENTS
        }

        // Cover art sits behind the same Authorization header as the stream, so it needs the OkHttp client.
        fun artworkDataSourceFactory(): DataSource.Factory = httpDataSourceFactory

        fun playbackDataSourceFactory(): DataSource.Factory =
            CacheDataSource
                .Factory()
                .setCache(cache)
                .setUpstreamDataSourceFactory(DefaultDataSource.Factory(context, httpDataSourceFactory))
                .setCacheWriteDataSinkFactory(null)
                .setFlags(CacheDataSource.FLAG_IGNORE_CACHE_ON_ERROR)

        companion object {
            const val DOWNLOAD_CHANNEL_ID = "jam_downloads"
            private val UNMETERED_REQUIREMENTS = Requirements(Requirements.NETWORK_UNMETERED)
            private const val DOWNLOAD_CONTENT_DIRECTORY = "downloads"
            private const val DOWNLOAD_THREADS = 6
        }
    }
