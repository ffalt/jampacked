package io.github.ffalt.jampacked.ui.browse

import androidx.annotation.StringRes
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.repo.BrowseSort

enum class BrowseSortKind {
    ALBUM,
    ARTIST,
    SERIES,
    FOLDER,
    TRACK
}

data class BrowseSortField(
    val key: String,
    @param:StringRes val labelRes: Int
)

data class BrowseYearRange(
    val fromYear: Int?,
    val toYear: Int?
)

const val OLDEST_DECADE = 1960

fun sortFields(kind: BrowseSortKind): List<BrowseSortField> =
    when (kind) {
        BrowseSortKind.ALBUM -> albumSortFields
        BrowseSortKind.ARTIST -> artistSortFields
        BrowseSortKind.SERIES -> seriesSortFields
        BrowseSortKind.FOLDER -> folderSortFields
        BrowseSortKind.TRACK -> trackSortFields
    }

fun hasYearFilter(kind: BrowseSortKind): Boolean =
    when (kind) {
        BrowseSortKind.ALBUM, BrowseSortKind.FOLDER, BrowseSortKind.TRACK -> true
        BrowseSortKind.ARTIST, BrowseSortKind.SERIES -> false
    }

fun decades(currentYear: Int): List<Int> {
    val newest = (currentYear / 10) * 10
    return (newest downTo OLDEST_DECADE step 10).toList()
}

fun yearRanges(currentYear: Int): List<BrowseYearRange> =
    listOf(BrowseYearRange(null, null)) +
        decades(currentYear).map { BrowseYearRange(it, it + 9) } +
        BrowseYearRange(null, OLDEST_DECADE - 1)

private val indexField = BrowseSortField(BrowseSort.DEFAULT_FIELD, R.string.sort_index)
private val nameField = BrowseSortField(BrowseSort.NAME_FIELD, R.string.sort_name)
private val titleField = BrowseSortField("title", R.string.sort_title)
private val artistField = BrowseSortField("artist", R.string.sort_artist)
private val albumField = BrowseSortField("album", R.string.sort_album)
private val yearField = BrowseSortField("year", R.string.sort_year)
private val createdField = BrowseSortField("created", R.string.sort_added)
private val updatedField = BrowseSortField("updated", R.string.sort_updated)

private val albumSortFields =
    listOf(
        indexField,
        nameField,
        artistField,
        yearField,
        BrowseSortField("duration", R.string.sort_duration),
        createdField,
        updatedField
    )

private val artistSortFields = listOf(indexField, nameField, createdField, updatedField)

private val seriesSortFields = listOf(indexField, nameField, createdField, updatedField)

private val folderSortFields =
    listOf(indexField, nameField, titleField, artistField, albumField, yearField, createdField, updatedField)

private val trackSortFields =
    listOf(
        BrowseSortField(BrowseSort.DEFAULT_FIELD, R.string.sort_default),
        titleField,
        albumField,
        BrowseSortField("trackNr", R.string.sort_track_number),
        BrowseSortField("discNr", R.string.sort_disc_number),
        BrowseSortField("filename", R.string.sort_filename),
        createdField,
        updatedField
    )
