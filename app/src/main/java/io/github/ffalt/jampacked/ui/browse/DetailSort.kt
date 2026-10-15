package io.github.ffalt.jampacked.ui.browse

import androidx.compose.runtime.Composable
import androidx.compose.runtime.saveable.Saver
import androidx.compose.runtime.saveable.listSaver
import androidx.compose.ui.res.stringResource
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.repo.BrowseSection
import io.github.ffalt.jampacked.data.repo.BrowseSort
import io.github.ffalt.jampacked.ui.components.RadioEntry

data class DetailSort(
    val orderBy: String = BrowseSort.DEFAULT_FIELD,
    val descending: Boolean = false,
    val albumType: String? = null
) {
    val isDefault: Boolean get() = orderBy == BrowseSort.DEFAULT_FIELD && albumType == null

    val keepsSections: Boolean get() = orderBy == BrowseSort.DEFAULT_FIELD
}

val detailSortSaver: Saver<DetailSort, Any> =
    listSaver(
        save = { listOf(it.orderBy, it.descending, it.albumType.orEmpty()) },
        restore = {
            DetailSort(
                orderBy = it[0] as String,
                descending = it[1] as Boolean,
                albumType = (it[2] as String).takeIf(String::isNotEmpty)
            )
        }
    )

const val DETAIL_NAME_FIELD = "name"
const val DETAIL_YEAR_FIELD = "year"
const val ALL_TYPES = ""

/**
 * The server's own order groups by album type, so a chosen field has to flatten the groups to
 * order across all of them.
 */
fun detailSections(
    sections: List<BrowseSection>,
    sort: DetailSort
): List<BrowseSection> {
    val picked = sections.filter { sort.albumType == null || it.title == sort.albumType }
    if (sort.keepsSections) return picked

    val entries = picked.flatMap { it.items }
    val sorted =
        when (sort.orderBy) {
            DETAIL_NAME_FIELD -> entries.sortedBy { it.title.lowercase() }
            DETAIL_YEAR_FIELD -> entries.sortedWith(compareBy({ it.year ?: 0 }, { it.title.lowercase() }))
            else -> entries
        }
    return listOf(BrowseSection("", if (sort.descending) sorted.asReversed() else sorted))
}

@Composable
fun DetailSortSheet(
    sections: List<BrowseSection>,
    sort: DetailSort,
    onChange: (DetailSort) -> Unit,
    onDismiss: () -> Unit
) {
    SortSheet(
        onDismiss = onDismiss,
        groups =
            buildList {
                add(
                    SortGroup(
                        title = stringResource(R.string.sort_by),
                        options =
                            listOf(
                                RadioEntry(BrowseSort.DEFAULT_FIELD, stringResource(R.string.sort_default)),
                                RadioEntry(DETAIL_NAME_FIELD, stringResource(R.string.sort_name)),
                                RadioEntry(DETAIL_YEAR_FIELD, stringResource(R.string.sort_year))
                            ),
                        value = sort.orderBy,
                        onChange = { onChange(sort.copy(orderBy = it)) }
                    )
                )
                if (sort.orderBy != BrowseSort.DEFAULT_FIELD) {
                    add(directionGroup(sort.descending) { onChange(sort.copy(descending = it)) })
                }
                if (sections.size > 1) {
                    add(
                        SortGroup(
                            title = stringResource(R.string.sort_type_filter),
                            options =
                                listOf(RadioEntry(ALL_TYPES, stringResource(R.string.filter_all))) +
                                    sections.map { RadioEntry(it.title, albumTypeLabel(it.title)) },
                            value = sort.albumType ?: ALL_TYPES,
                            onChange = { onChange(sort.copy(albumType = it.takeIf { key -> key != ALL_TYPES })) }
                        )
                    )
                }
            }
    )
}

@Composable
fun detailSortLabel(sort: DetailSort): String {
    if (sort.isDefault) return stringResource(R.string.sort_action)
    val parts =
        listOfNotNull(
            detailFieldLabel(sort.orderBy),
            sort.albumType?.let { albumTypeLabel(it) }
        )
    return parts.joinToString(DETAIL_SEPARATOR)
}

fun detailSortIcon(sort: DetailSort): String =
    when {
        sort.orderBy == BrowseSort.DEFAULT_FIELD -> "view-lines"
        sort.descending -> "down-dir"
        else -> "up-dir"
    }

@Composable
private fun detailFieldLabel(orderBy: String): String? =
    when (orderBy) {
        DETAIL_NAME_FIELD -> stringResource(R.string.sort_name)
        DETAIL_YEAR_FIELD -> stringResource(R.string.sort_year)
        else -> null
    }

private const val DETAIL_SEPARATOR = "  ·  "
