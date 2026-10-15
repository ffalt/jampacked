package io.github.ffalt.jampacked.data.repo

import com.apollographql.apollo.api.Optional
import io.github.ffalt.jampacked.graphql.type.AlbumOrderFields
import io.github.ffalt.jampacked.graphql.type.AlbumOrderParametersQL
import io.github.ffalt.jampacked.graphql.type.ArtistOrderFields
import io.github.ffalt.jampacked.graphql.type.ArtistOrderParametersQL
import io.github.ffalt.jampacked.graphql.type.DefaultOrderFields
import io.github.ffalt.jampacked.graphql.type.FolderOrderFields
import io.github.ffalt.jampacked.graphql.type.FolderOrderParametersQL
import io.github.ffalt.jampacked.graphql.type.SeriesOrderParametersQL
import io.github.ffalt.jampacked.graphql.type.TrackOrderFields
import io.github.ffalt.jampacked.graphql.type.TrackOrderParametersQL

data class BrowseSort(
    val orderBy: String = DEFAULT_FIELD,
    val descending: Boolean = false,
    val fromYear: Int? = null,
    val toYear: Int? = null
) {
    val isDefault: Boolean
        get() = orderBy == DEFAULT_FIELD && !descending && fromYear == null && toYear == null

    val hasYearRange: Boolean get() = fromYear != null || toYear != null

    fun stored(): String = listOf(orderBy, descending, fromYear.orBlank(), toYear.orBlank()).joinToString(SEPARATOR)

    companion object {
        const val DEFAULT_FIELD = "default"
        const val NAME_FIELD = "name"

        private const val SEPARATOR = "|"
        private const val PART_COUNT = 4

        fun parse(value: String?): BrowseSort {
            val parts = value?.split(SEPARATOR).orEmpty()
            if (parts.size != PART_COUNT) return BrowseSort()
            return BrowseSort(
                orderBy = parts[0].ifBlank { DEFAULT_FIELD },
                descending = parts[1].toBooleanStrictOrNull() == true,
                fromYear = parts[2].toIntOrNull(),
                toYear = parts[3].toIntOrNull()
            )
        }
    }
}

private fun Int?.orBlank(): String = this?.toString().orEmpty()

internal fun <T> T?.optional(): Optional<T?> = Optional.presentIfNotNull(this)

private val BrowseSort.orderedField: String?
    get() = orderBy.takeIf { it != BrowseSort.DEFAULT_FIELD }

internal fun BrowseSort.albumOrder(): List<AlbumOrderParametersQL>? =
    AlbumOrderFields.knownEntries.firstOrNull { it.rawValue == orderedField }?.let {
        listOf(AlbumOrderParametersQL(orderDesc = Optional.present(descending), orderBy = Optional.present(it)))
    }

internal fun BrowseSort.artistOrder(): List<ArtistOrderParametersQL>? =
    ArtistOrderFields.knownEntries.firstOrNull { it.rawValue == orderedField }?.let {
        listOf(ArtistOrderParametersQL(orderDesc = Optional.present(descending), orderBy = Optional.present(it)))
    }

internal fun BrowseSort.seriesOrder(): List<SeriesOrderParametersQL>? =
    DefaultOrderFields.knownEntries.firstOrNull { it.rawValue == orderedField }?.let {
        listOf(SeriesOrderParametersQL(orderDesc = Optional.present(descending), orderBy = Optional.present(it)))
    }

internal fun BrowseSort.folderOrder(): List<FolderOrderParametersQL>? =
    FolderOrderFields.knownEntries.firstOrNull { it.rawValue == orderedField }?.let {
        listOf(FolderOrderParametersQL(orderDesc = Optional.present(descending), orderBy = Optional.present(it)))
    }

internal fun BrowseSort.trackOrder(): List<TrackOrderParametersQL>? =
    TrackOrderFields.knownEntries.firstOrNull { it.rawValue == orderedField }?.let {
        listOf(TrackOrderParametersQL(orderDesc = Optional.present(descending), orderBy = Optional.present(it)))
    }
