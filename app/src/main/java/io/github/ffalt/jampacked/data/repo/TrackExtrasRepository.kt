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
data class Lyrics(
    val text: String,
    val source: String?
)

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
                val key = QueryCache.cacheKey("TrackLyricsResult", trackId)
                cache.read(key, serializer<Lyrics?>())?.let { return@runCatching it }

                val response = apollo.client().query(TrackLyricsResultQuery(trackId)).execute()
                val raw = response.data?.track?.lyrics
                val result = raw?.lyrics?.takeIf { it.isNotBlank() }?.let { Lyrics(it, raw.source) }
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
