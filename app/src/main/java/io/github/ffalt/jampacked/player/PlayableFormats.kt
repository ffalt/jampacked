package io.github.ffalt.jampacked.player

import android.media.MediaCodecList
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PlayableFormats
    @Inject
    constructor() {
        val formats: Set<String> by lazy { decodableFormats(deviceDecoderTypes()) }

        private fun deviceDecoderTypes(): Set<String> =
            MediaCodecList(MediaCodecList.REGULAR_CODECS)
                .codecInfos
                .asSequence()
                .filterNot { it.isEncoder }
                .flatMap { it.supportedTypes.asSequence() }
                .map { it.lowercase() }
                .toSet()

        private fun decodableFormats(decoderTypes: Set<String>): Set<String> =
            SERVER_FORMAT_MIME_TYPES
                .filterValues { mimeTypes -> mimeTypes.any { it in decoderTypes } }
                .keys + ALWAYS_DECODABLE

        private companion object {
            val SERVER_FORMAT_MIME_TYPES =
                mapOf(
                    "mp3" to listOf("audio/mpeg"),
                    "flac" to listOf("audio/flac"),
                    "ogg" to listOf("audio/vorbis", "audio/opus"),
                    "oga" to listOf("audio/vorbis", "audio/opus"),
                    "webma" to listOf("audio/vorbis", "audio/opus"),
                    "m4a" to listOf("audio/mp4a-latm", "audio/alac"),
                    "m4b" to listOf("audio/mp4a-latm", "audio/alac"),
                    "mp4" to listOf("audio/mp4a-latm", "audio/alac")
                )

            val ALWAYS_DECODABLE = setOf("wav")
        }
    }
