package io.github.ffalt.jampacked.data

import android.content.Context
import androidx.core.net.toUri
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.offline.Download
import androidx.media3.exoplayer.offline.DownloadRequest
import androidx.media3.exoplayer.offline.DownloadService
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.data.auth.AuthRepository
import io.github.ffalt.jampacked.data.db.PinDao
import io.github.ffalt.jampacked.data.db.PinRow
import io.github.ffalt.jampacked.data.db.PinTrackRow
import io.github.ffalt.jampacked.player.Downloads
import io.github.ffalt.jampacked.player.JamDownloadService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class PinMedia(
    val id: String,
    val name: String,
    val objType: String,
    val tracks: List<TrackEntry>
)

data class PinStat(
    val files: Int,
    val bytes: Long
)

data class DownloadInfo(
    val id: String,
    val state: String,
    val percent: Float,
    val bytes: Long,
    val contentLength: Long
)

@UnstableApi
@Singleton
class PinRepository
    @Inject
    constructor(
        @ApplicationContext private val context: Context,
        private val dao: PinDao,
        private val json: Json,
        private val auth: AuthRepository,
        private val downloads: Downloads
    ) {
        private val changes = MutableStateFlow(0)

        private fun key(id: String) = "pin_$id"

        suspend fun pin(
            id: String,
            objType: String,
            name: String,
            tracks: List<TrackEntry>
        ) {
            val session = auth.session ?: return
            if (tracks.isEmpty()) return

            val pinKey = key(id)
            val media = PinMedia(id = id, name = name, objType = objType, tracks = tracks)

            dao.delete(pinKey)
            dao.deleteTracks(pinKey)
            dao.insert(
                PinRow(
                    key = pinKey,
                    data = json.encodeToString(media),
                    date = System.currentTimeMillis(),
                    version = DATA_FORMAT_VERSION
                )
            )
            dao.insertTracks(tracks.map { PinTrackRow(pinKey = pinKey, trackId = it.id) })

            tracks.forEach { track ->
                val request =
                    DownloadRequest.Builder(track.id, session.streamUrl(track.id).toUri()).build()
                DownloadService.sendAddDownload(
                    context,
                    JamDownloadService::class.java,
                    request,
                    false
                )
            }
            changes.value++
        }

        suspend fun unpin(id: String) {
            val pinKey = key(id)

            val removable = dao.exclusiveTrackIds(pinKey)
            dao.deleteTracks(pinKey)
            dao.delete(pinKey)
            removable.forEach { trackId ->
                DownloadService.sendRemoveDownload(
                    context,
                    JamDownloadService::class.java,
                    trackId,
                    false
                )
            }
            changes.value++
        }

        suspend fun isPinned(id: String): Boolean = dao.find(key(id)) != null

        suspend fun count(): Int = dao.countPins()

        suspend fun all(): List<PinMedia> =
            dao.all().mapNotNull { row ->
                runCatching { json.decodeFromString<PinMedia>(row.data) }.getOrNull()
            }

        suspend fun clear() {
            dao.clearTracks()
            dao.clear()
            DownloadService.sendRemoveAllDownloads(
                context,
                JamDownloadService::class.java,
                false
            )
            changes.value++
        }

        suspend fun stat(): PinStat =
            withContext(Dispatchers.IO) {
                var files = 0
                var bytes = 0L
                downloadList().forEach {
                    if (it.state == Download.STATE_COMPLETED) {
                        files++
                        bytes += it.contentLength.coerceAtLeast(0)
                    }
                }
                PinStat(files, bytes)
            }

        fun downloads(): List<DownloadInfo> = downloadList().map { it.toInfo() }

        fun downloadsPaused(): Boolean = downloads.downloadManager.downloadsPaused

        fun pauseDownloads() {
            DownloadService.sendPauseDownloads(context, JamDownloadService::class.java, false)
        }

        fun resumeDownloads() {
            DownloadService.sendResumeDownloads(context, JamDownloadService::class.java, false)
        }

        private fun Download.toInfo(): DownloadInfo =
            DownloadInfo(
                id = request.id,
                state =
                    when (state) {
                        Download.STATE_COMPLETED -> "Completed"
                        Download.STATE_DOWNLOADING -> "Downloading"
                        Download.STATE_FAILED -> "Failed"
                        Download.STATE_QUEUED -> "Queued"
                        Download.STATE_REMOVING -> "Removing"
                        Download.STATE_RESTARTING -> "Restarting"
                        Download.STATE_STOPPED -> "Stopped"
                        else -> "Unknown"
                    },
                percent = percentDownloaded.takeIf { !it.isNaN() } ?: 0f,
                bytes = bytesDownloaded,
                contentLength = contentLength.coerceAtLeast(0)
            )

        private fun downloadList(): List<Download> {
            val result = mutableListOf<Download>()
            downloads.downloadManager.downloadIndex.getDownloads().use { cursor ->
                while (cursor.moveToNext()) result.add(cursor.download)
            }
            return result
        }

        private companion object {
            const val DATA_FORMAT_VERSION = 1
        }
    }
