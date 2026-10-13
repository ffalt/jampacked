package io.github.ffalt.jampacked.data.repo

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class BrowseSectionsTest {
    private fun album(name: String) = BrowseEntry(name, name, "", "album")

    @Test
    fun `the episode number wins over the year`() {
        assertEquals("Episode 3", albumEntryDescription("3", 1979))
    }

    @Test
    fun `the year is used when there is no episode number`() {
        assertEquals("1979", albumEntryDescription(null, 1979))
        assertEquals("1979", albumEntryDescription("", 1979))
    }

    @Test
    fun `neither leaves the description empty`() {
        assertEquals("", albumEntryDescription(null, null))

        assertEquals("", albumEntryDescription(null, 0))
    }

    @Test
    fun `albums group by type in the order the types first appear`() {
        val albums = listOf(album("a"), album("b"), album("c"), album("d"))
        val types = listOf("album", "ep", "album", "live")

        val sections = browseSections(albums, types)

        assertEquals(listOf("album", "ep", "live"), sections.map { it.title })
        assertEquals(listOf("a", "c"), sections[0].items.map { it.title })
        assertEquals(listOf("b"), sections[1].items.map { it.title })
        assertEquals(listOf("d"), sections[2].items.map { it.title })
    }

    @Test
    fun `a missing type groups under an empty title rather than being dropped`() {
        val sections = browseSections(listOf(album("a"), album("b")), listOf(null, "ep"))

        assertEquals(listOf("", "ep"), sections.map { it.title })
        assertEquals(listOf("a"), sections[0].items.map { it.title })
    }

    @Test
    fun `no albums means no sections`() {
        assertTrue(browseSections(emptyList(), emptyList()).isEmpty())
    }

    @Test
    fun `every album lands in exactly one section`() {
        val albums = (1..20).map { album("a$it") }
        val types = List(20) { if (it % 3 == 0) "ep" else "album" }

        val sections = browseSections(albums, types)

        assertEquals(20, sections.sumOf { it.items.size })
    }
}
