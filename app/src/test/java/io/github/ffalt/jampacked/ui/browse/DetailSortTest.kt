package io.github.ffalt.jampacked.ui.browse

import io.github.ffalt.jampacked.data.repo.BrowseEntry
import io.github.ffalt.jampacked.data.repo.BrowseSection
import io.github.ffalt.jampacked.data.repo.BrowseSort
import org.junit.Assert.assertEquals
import org.junit.Test

class DetailSortTest {
    private fun album(
        title: String,
        year: Int?
    ) = BrowseEntry(id = title, title = title, kind = "album", year = year)

    private val sections =
        listOf(
            BrowseSection("album", listOf(album("Hounds of Love", 1985), album("Aerial", 2005))),
            BrowseSection("ep", listOf(album("Brazil", 1992), album("Lyra", 2007)))
        )

    private fun titles(result: List<BrowseSection>): List<String> = result.flatMap { it.items }.map { it.title }

    @Test
    fun `the untouched sort leaves the servers grouping alone`() {
        val result = detailSections(sections, DetailSort())
        assertEquals(sections, result)
    }

    @Test
    fun `a type keeps only that group`() {
        val result = detailSections(sections, DetailSort(albumType = "ep"))
        assertEquals(listOf("Brazil", "Lyra"), titles(result))
        assertEquals(1, result.size)
    }

    @Test
    fun `sorting by name flattens the groups so the order runs across all of them`() {
        val result = detailSections(sections, DetailSort(orderBy = DETAIL_NAME_FIELD))
        assertEquals(1, result.size)
        assertEquals(listOf("Aerial", "Brazil", "Hounds of Love", "Lyra"), titles(result))
    }

    @Test
    fun `descending reverses the order`() {
        val result = detailSections(sections, DetailSort(orderBy = DETAIL_NAME_FIELD, descending = true))
        assertEquals(listOf("Lyra", "Hounds of Love", "Brazil", "Aerial"), titles(result))
    }

    @Test
    fun `sorting by year is chronological across the groups`() {
        val result = detailSections(sections, DetailSort(orderBy = DETAIL_YEAR_FIELD))
        assertEquals(listOf("Hounds of Love", "Brazil", "Aerial", "Lyra"), titles(result))
    }

    @Test
    fun `an album cached before the year existed sorts first rather than disappearing`() {
        val withUnknown = sections + BrowseSection("live", listOf(album("Before The Dawn", null)))
        val result = detailSections(withUnknown, DetailSort(orderBy = DETAIL_YEAR_FIELD))
        assertEquals("Before The Dawn", titles(result).first())
        assertEquals(5, titles(result).size)
    }

    @Test
    fun `a type and a field combine, filtering first and then ordering`() {
        val result = detailSections(sections, DetailSort(orderBy = DETAIL_NAME_FIELD, albumType = "album"))
        assertEquals(listOf("Aerial", "Hounds of Love"), titles(result))
    }

    @Test
    fun `only the untouched sort counts as default and keeps the groups`() {
        assertEquals(true, DetailSort().isDefault)
        assertEquals(false, DetailSort(albumType = "ep").isDefault)
        assertEquals(false, DetailSort(orderBy = DETAIL_NAME_FIELD).isDefault)
        assertEquals(true, DetailSort(albumType = "ep").keepsSections)
        assertEquals(false, DetailSort(orderBy = BrowseSort.DEFAULT_FIELD.plus("x")).keepsSections)
    }
}
