package io.github.ffalt.jampacked.data.cache

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.serializer
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

@Serializable
data class Payload(
    val id: String,
    val count: Int
)

class QueryCacheTest {
    private lateinit var store: FakeCacheStore
    private lateinit var cache: QueryCache
    private val serializer = serializer<Payload>()
    private val sample = Payload("a", 1)

    @Before
    fun setUp() {
        store = FakeCacheStore()
        cache = QueryCache(store, Json { ignoreUnknownKeys = true })
        cache.now = { 1_000L }
    }

    @Test
    fun `cache miss fetches, persists and reports not-from-cache`() =
        runTest {
            var fetches = 0
            val emissions =
                cache
                    .cachedQuery("k", serializer) {
                        fetches++
                        sample
                    }.toList()

            assertEquals(1, fetches)
            assertEquals(Resource.Loading, emissions.first())
            val success = emissions.last() as Resource.Success
            assertEquals(sample, success.data)
            assertEquals(false, success.fromCache)

            val stored = store.rows.getValue("k")
            assertEquals(QueryCache.CURRENT_VERSION, stored.version)
            assertEquals(1_000L, stored.date)
        }

    @Test
    fun `cache hit short-circuits the network`() =
        runTest {
            cache.write("k", sample, serializer)
            var fetches = 0
            val emissions =
                cache
                    .cachedQuery("k", serializer) {
                        fetches++
                        Payload("network", 99)
                    }.toList()
            assertEquals("must not hit the network on a cache hit", 0, fetches)
            val success = emissions.last() as Resource.Success
            assertEquals(sample, success.data)
            assertEquals(true, success.fromCache)
        }

    @Test
    fun `forceRefresh skips the read but still writes`() =
        runTest {
            cache.write("k", sample, serializer)
            val fresh = Payload("network", 99)
            var fetches = 0
            val emissions =
                cache
                    .cachedQuery("k", serializer, forceRefresh = true) {
                        fetches++
                        fresh
                    }.toList()
            assertEquals(1, fetches)
            val success = emissions.last() as Resource.Success
            assertEquals(fresh, success.data)
            assertEquals(false, success.fromCache)
            assertEquals(fresh, cache.read("k", serializer))
        }

    @Test
    fun `a row from a different version counts as a miss`() =
        runTest {
            store.put(
                CachedDocument(
                    key = "k",
                    data = """{"id":"old","count":7}""",
                    date = 1L,
                    version = QueryCache.CURRENT_VERSION + 10
                )
            )

            assertNull("stale version must not be readable", cache.read("k", serializer))

            var fetches = 0
            cache
                .cachedQuery("k", serializer) {
                    fetches++
                    sample
                }.toList()
            assertEquals("stale version must fall through to the network", 1, fetches)
            assertEquals(QueryCache.CURRENT_VERSION, store.rows.getValue("k").version)
        }

    @Test
    fun `undeserializable payload counts as a miss rather than throwing`() =
        runTest {
            store.put(
                CachedDocument("k", "this is not json", 1L, QueryCache.CURRENT_VERSION)
            )
            assertNull(cache.read("k", serializer))
        }

    @Test
    fun `a failing fetch emits Failure and writes nothing`() =
        runTest {
            val boom = IllegalStateException("network down")
            val emissions = cache.cachedQuery("k", serializer) { throw boom }.toList()
            val failure = emissions.last() as Resource.Failure
            assertSame(boom, failure.error)
            assertTrue(store.rows.isEmpty())
        }

    @Test
    fun `removeStartingWith only removes the matching prefix`() =
        runTest {
            cache.write("Album:1", sample, serializer)
            cache.write("Album:2", sample, serializer)
            cache.write("Artist:1", sample, serializer)
            cache.removeStartingWith("Album")
            assertEquals(setOf("Artist:1"), store.rows.keys)
        }

    @Test
    fun `removeStartingWith with an empty prefix is a no-op`() =
        runTest {
            cache.write("Album:1", sample, serializer)
            cache.removeStartingWith("")
            assertEquals(setOf("Album:1"), store.rows.keys)
        }
}
