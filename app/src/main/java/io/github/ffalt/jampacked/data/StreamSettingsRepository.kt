package io.github.ffalt.jampacked.data

import io.github.ffalt.jampacked.player.PlayableFormats
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class StreamSettingsRepository
    @Inject
    constructor(
        private val store: SettingsRepository,
        private val playable: PlayableFormats
    ) {
        private val _state = MutableStateFlow(StreamSettings())
        val state: StateFlow<StreamSettings> = _state.asStateFlow()

        val playableFormats: Set<String> get() = playable.formats

        fun streamRequestFor(mediaFormat: String?): StreamRequest = _state.value.streaming.requestFor(mediaFormat, playable.formats)

        fun downloadRequestFor(mediaFormat: String?): StreamRequest = _state.value.downloads.requestFor(mediaFormat, playable.formats)

        suspend fun load() {
            _state.value =
                StreamSettings(
                    streaming =
                        StreamOptions(
                            format = parseFormat(store.getSetting(KEY_STREAM_FORMAT)),
                            cap = parseCap(store.getSetting(KEY_STREAM_CAP))
                        ),
                    downloads =
                        StreamOptions(
                            format = parseFormat(store.getSetting(KEY_DOWNLOAD_FORMAT)),
                            cap = parseCap(store.getSetting(KEY_DOWNLOAD_CAP))
                        )
                )
        }

        suspend fun setStreaming(options: StreamOptions) {
            _state.value = _state.value.copy(streaming = options)
            store.setSetting(KEY_STREAM_FORMAT, options.format.name.lowercase())
            store.setSetting(KEY_STREAM_CAP, options.cap.name.lowercase())
        }

        suspend fun setDownloads(options: StreamOptions) {
            _state.value = _state.value.copy(downloads = options)
            store.setSetting(KEY_DOWNLOAD_FORMAT, options.format.name.lowercase())
            store.setSetting(KEY_DOWNLOAD_CAP, options.cap.name.lowercase())
        }

        private fun parseFormat(value: String?): StreamFormat =
            StreamFormat.entries.firstOrNull {
                it.name.equals(value, ignoreCase = true)
            } ?: StreamOptions().format

        private fun parseCap(value: String?): BitrateCap =
            BitrateCap.entries.firstOrNull {
                it.name.equals(value, ignoreCase = true)
            } ?: StreamOptions().cap

        private companion object {
            const val KEY_STREAM_FORMAT = "stream_format"
            const val KEY_STREAM_CAP = "stream_bitrate_cap"
            const val KEY_DOWNLOAD_FORMAT = "download_format"
            const val KEY_DOWNLOAD_CAP = "download_bitrate_cap"
        }
    }
