package io.github.ffalt.jampacked.ui.browse

import io.github.ffalt.jampacked.graphql.type.AlbumOrderFields
import io.github.ffalt.jampacked.graphql.type.ArtistOrderFields
import io.github.ffalt.jampacked.graphql.type.DefaultOrderFields
import io.github.ffalt.jampacked.graphql.type.FolderOrderFields
import io.github.ffalt.jampacked.graphql.type.TrackOrderFields
import org.junit.Assert.assertEquals
import org.junit.Test

class BrowseSortOptionsTest {
    @Test
    fun `every offered field is one the schema accepts`() {
        assertOffered(BrowseSortKind.ALBUM, AlbumOrderFields.knownEntries.map { it.rawValue })
        assertOffered(BrowseSortKind.ARTIST, ArtistOrderFields.knownEntries.map { it.rawValue })
        assertOffered(BrowseSortKind.SERIES, DefaultOrderFields.knownEntries.map { it.rawValue })
        assertOffered(BrowseSortKind.FOLDER, FolderOrderFields.knownEntries.map { it.rawValue })
        assertOffered(BrowseSortKind.TRACK, TrackOrderFields.knownEntries.map { it.rawValue })
    }

    @Test
    fun `the decades run from the current one back to the oldest`() {
        assertEquals(listOf(2020, 2010, 2000, 1990, 1980, 1970, 1960), decades(2026))
    }

    @Test
    fun `a year late in a decade does not open the next one`() {
        assertEquals(2020, decades(2029).first())
        assertEquals(2030, decades(2030).first())
    }

    @Test
    fun `the year ranges are any, one per decade, and everything older`() {
        val ranges = yearRanges(2026)
        assertEquals(BrowseYearRange(null, null), ranges.first())
        assertEquals(BrowseYearRange(2020, 2029), ranges[1])
        assertEquals(BrowseYearRange(null, 1959), ranges.last())
        assertEquals(decades(2026).size + 2, ranges.size)
    }

    private fun assertOffered(
        kind: BrowseSortKind,
        accepted: List<String>
    ) {
        val unknown = sortFields(kind).map { it.key }.filterNot { it in accepted }
        assertEquals(emptyList<String>(), unknown)
    }
}
