package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.cache.QueryCache
import io.github.ffalt.jampacked.graphql.TrackLyricsResultQuery
import io.github.ffalt.jampacked.graphql.WaveformResultQuery
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.serializer
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class LyricsLine(
    val timeMs: Long,
    val text: String
)

@Serializable
data class Lyrics(
    val text: String?,
    val lines: List<LyricsLine>,
    val source: String?
)

internal fun selectLyrics(entries: List<Lyrics>): Lyrics? =
    entries.firstOrNull { it.lines.isNotEmpty() }
        ?: entries.firstOrNull { !it.text.isNullOrBlank() }

@Singleton
class TrackExtrasRepository
    @Inject
    constructor(
        private val apollo: ApolloProvider,
        private val cache: QueryCache,
        private val json: Json
    ) {
        suspend fun lyrics(trackId: String): Result<Lyrics?> =
            runCatching {
                val key = QueryCache.cacheKey("TrackLyricsSyncedResult", trackId)
                cache.read(key, serializer<Lyrics?>())?.let { return@runCatching it }

                val response = apollo.client().query(TrackLyricsResultQuery(trackId)).execute()
                val entries =
                    response.data?.track?.lyrics?.entries.orEmpty().map { entry ->
                        Lyrics(
                            text = entry.lyrics,
                            lines = entry.syncedLines.orEmpty().map { LyricsLine(it.timestamp.toLong(), it.text) },
                            source = entry.source
                        )
                    }
                val result = selectLyrics(entries)
                cache.write(key, result, serializer<Lyrics?>())
                result
            }

        suspend fun waveform(trackId: String): Result<WaveformJson?> =
            runCatching {
                val key = QueryCache.cacheKey("WaveformResult", trackId)
                cache.read(key, serializer<WaveformJson?>())?.let { return@runCatching it }

                val response = apollo.client().query(WaveformResultQuery(trackId)).execute()
                val raw = response.data?.waveform?.json ?: return@runCatching null
                val parsed = runCatching { json.decodeFromString<WaveformJson>(raw) }.getOrNull()
                cache.write(key, parsed, serializer<WaveformJson?>())
                parsed
            }
    }
