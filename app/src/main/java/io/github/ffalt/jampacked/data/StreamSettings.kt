package io.github.ffalt.jampacked.data

const val MP3_EXTENSION = "mp3"

enum class StreamFormat {
    MP3,
    ORIGINAL
}

enum class BitrateCap(
    val kbps: Int?
) {
    OFF(null),
    KBPS_96(96),
    KBPS_128(128),
    KBPS_192(192),
    KBPS_256(256),
    KBPS_320(320)
}

data class StreamRequest(
    val extension: String = MP3_EXTENSION,
    val maxBitRate: Int? = null
)

data class StreamOptions(
    val format: StreamFormat = StreamFormat.MP3,
    val cap: BitrateCap = BitrateCap.OFF
) {
    fun requestFor(
        mediaFormat: String?,
        playableFormats: Set<String>
    ): StreamRequest = StreamRequest(extensionFor(mediaFormat, playableFormats), cap.kbps)

    private fun extensionFor(
        mediaFormat: String?,
        playableFormats: Set<String>
    ): String {
        if (format == StreamFormat.MP3) return MP3_EXTENSION
        val source = mediaFormat?.lowercase() ?: return MP3_EXTENSION
        return if (source in playableFormats) source else MP3_EXTENSION
    }
}

data class StreamSettings(
    val streaming: StreamOptions = StreamOptions(),
    val downloads: StreamOptions = StreamOptions()
)
