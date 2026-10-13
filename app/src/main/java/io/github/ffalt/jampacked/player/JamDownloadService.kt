package io.github.ffalt.jampacked.player

import android.app.Notification
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.offline.Download
import androidx.media3.exoplayer.offline.DownloadManager
import androidx.media3.exoplayer.offline.DownloadService
import androidx.media3.exoplayer.scheduler.Scheduler
import dagger.hilt.android.AndroidEntryPoint
import io.github.ffalt.jampacked.R
import javax.inject.Inject

private const val FOREGROUND_NOTIFICATION_ID = 2001

@UnstableApi
@AndroidEntryPoint
class JamDownloadService :
    DownloadService(
        FOREGROUND_NOTIFICATION_ID,
        DEFAULT_FOREGROUND_NOTIFICATION_UPDATE_INTERVAL,
        Downloads.DOWNLOAD_CHANNEL_ID,
        R.string.download_channel_name,
        0
    ) {
    @Inject
    lateinit var downloads: Downloads

    override fun getDownloadManager(): DownloadManager = downloads.downloadManager

    override fun getScheduler(): Scheduler? = null

    override fun getForegroundNotification(
        downloads: List<Download>,
        notMetRequirements: Int
    ): Notification =
        this.downloads.notificationHelper.buildProgressNotification(
            this,
            android.R.drawable.stat_sys_download,
            null,
            null,
            downloads,
            notMetRequirements
        )
}
