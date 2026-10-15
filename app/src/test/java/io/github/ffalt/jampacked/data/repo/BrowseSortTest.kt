package io.github.ffalt.jampacked.data.repo

import io.github.ffalt.jampacked.graphql.type.AlbumOrderFields
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class BrowseSortTest {
    @Test
    fun `a stored sort comes back unchanged`() {
        val sort = BrowseSort(orderBy = "year", descending = true, fromYear = 1990, toYear = 1999)
        assertEquals(sort, BrowseSort.parse(sort.stored()))
    }

    @Test
    fun `a stored sort without a year range comes back unchanged`() {
        val sort = BrowseSort(orderBy = "name", descending = false)
        assertEquals(sort, BrowseSort.parse(sort.stored()))
    }

    @Test
    fun `nothing stored means the default sort`() {
        assertEquals(BrowseSort(), BrowseSort.parse(null))
    }

    @Test
    fun `a value from an older format falls back to the default sort`() {
        assertEquals(BrowseSort(), BrowseSort.parse("year|true"))
    }

    @Test
    fun `only the untouched sort counts as default`() {
        assertEquals(true, BrowseSort().isDefault)
        assertEquals(false, BrowseSort(orderBy = "year").isDefault)
        assertEquals(false, BrowseSort(descending = true).isDefault)
        assertEquals(false, BrowseSort(fromYear = 1990, toYear = 1999).isDefault)
    }

    @Test
    fun `the default sort sends no order, so a curated list keeps the order the server picked`() {
        assertNull(BrowseSort().albumOrder())
        assertNull(BrowseSort().artistOrder())
        assertNull(BrowseSort().seriesOrder())
        assertNull(BrowseSort().folderOrder())
        assertNull(BrowseSort().trackOrder())
    }

    @Test
    fun `a chosen field becomes the schema enum and its direction`() {
        val order = BrowseSort(orderBy = "year", descending = true).albumOrder()
        assertEquals(1, order?.size)
        assertEquals(AlbumOrderFields.year, order?.first()?.orderBy?.getOrNull())
        assertEquals(true, order?.first()?.orderDesc?.getOrNull())
    }

    @Test
    fun `a field the schema does not know sends no order`() {
        assertNull(BrowseSort(orderBy = "loudness").albumOrder())
    }

    @Test
    fun `the index ordering is name ascending, which is what a filtered index list asks for`() {
        val order = BrowseSort(orderBy = BrowseSort.NAME_FIELD, fromYear = 1980, toYear = 1989).albumOrder()
        assertEquals(AlbumOrderFields.name_, order?.first()?.orderBy?.getOrNull())
        assertEquals(false, order?.first()?.orderDesc?.getOrNull())
    }
}
