package io.github.ffalt.jampacked.ui.browse

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.repo.BrowseSort
import io.github.ffalt.jampacked.ui.components.RadioButtons
import io.github.ffalt.jampacked.ui.components.RadioEntry
import io.github.ffalt.jampacked.ui.components.SectionHeader
import io.github.ffalt.jampacked.ui.components.Separator
import io.github.ffalt.jampacked.ui.theme.JamDimens
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import java.util.Calendar

data class SortGroup(
    val title: String,
    val options: List<RadioEntry>,
    val value: String,
    val onChange: (String) -> Unit
)

@Composable
fun SortGroups(
    groups: List<SortGroup>,
    modifier: Modifier = Modifier
) {
    Column(modifier) {
        groups.forEachIndexed { index, group ->
            if (index > 0) Separator()
            SectionHeader(title = group.title)
            RadioButtons(
                options = group.options,
                value = group.value,
                onChange = group.onChange
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SortSheet(
    groups: List<SortGroup>,
    onDismiss: () -> Unit
) {
    val colors = LocalJamColors.current

    ModalBottomSheet(onDismissRequest = onDismiss, containerColor = colors.background) {
        SortGroups(
            groups = groups,
            modifier =
                Modifier
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = JamDimens.paddingLarge)
                    .padding(bottom = SHEET_BOTTOM)
        )
    }
}

@Composable
fun directionGroup(
    descending: Boolean,
    onChange: (Boolean) -> Unit
): SortGroup =
    SortGroup(
        title = stringResource(R.string.sort_direction),
        options =
            listOf(
                RadioEntry(ASCENDING, stringResource(R.string.sort_ascending)),
                RadioEntry(DESCENDING, stringResource(R.string.sort_descending))
            ),
        value = if (descending) DESCENDING else ASCENDING,
        onChange = { onChange(it == DESCENDING) }
    )

@Composable
fun BrowseSortSheet(
    kind: BrowseSortKind,
    sort: BrowseSort,
    onChange: (BrowseSort) -> Unit,
    onDismiss: () -> Unit
) {
    val ranges = yearRanges(currentYear())
    SortSheet(
        onDismiss = onDismiss,
        groups =
            buildList {
                add(
                    SortGroup(
                        title = stringResource(R.string.sort_by),
                        options = sortFields(kind).map { RadioEntry(it.key, stringResource(it.labelRes)) },
                        value = sort.orderBy,
                        onChange = { onChange(sort.copy(orderBy = it)) }
                    )
                )
                if (sort.orderBy != BrowseSort.DEFAULT_FIELD) {
                    add(directionGroup(sort.descending) { onChange(sort.copy(descending = it)) })
                }
                if (hasYearFilter(kind)) {
                    add(
                        SortGroup(
                            title = stringResource(R.string.sort_year_filter),
                            options = ranges.map { RadioEntry(it.key(), it.label()) },
                            value = BrowseYearRange(sort.fromYear, sort.toYear).key(),
                            onChange = { key ->
                                val range = ranges.firstOrNull { it.key() == key } ?: BrowseYearRange(null, null)
                                onChange(sort.copy(fromYear = range.fromYear, toYear = range.toYear))
                            }
                        )
                    )
                }
            }
    )
}

/**
 * The header subtitle says what a list is: its list type on the curated chains, and on a sortable
 * one the sort, falling back to the entry count while nothing has been chosen.
 */
@Composable
fun sortSubtitle(
    kind: BrowseSortKind,
    sort: BrowseSort,
    entryCount: String?
): String {
    val field =
        sortFields(kind)
            .firstOrNull { it.key == sort.orderBy }
            ?.let { stringResource(it.labelRes) }
            ?: stringResource(R.string.sort_default)
    val parts =
        listOfNotNull(
            field,
            BrowseYearRange(sort.fromYear, sort.toYear).label().takeIf { sort.hasYearRange },
            entryCount.takeIf { sort.isDefault }
        )
    return parts.joinToString(SUBTITLE_SEPARATOR)
}

fun sortIconName(sort: BrowseSort): String =
    when {
        sort.orderBy == BrowseSort.DEFAULT_FIELD -> "view-lines"
        sort.descending -> "down-dir"
        else -> "up-dir"
    }

internal fun BrowseYearRange.key(): String = "${fromYear ?: ""}-${toYear ?: ""}"

@Composable
private fun BrowseYearRange.label(): String =
    when {
        fromYear == null && toYear == null -> stringResource(R.string.sort_year_any)
        fromYear == null -> stringResource(R.string.sort_year_before, OLDEST_DECADE)
        else -> stringResource(R.string.sort_decade, fromYear)
    }

internal fun currentYear(): Int = Calendar.getInstance().get(Calendar.YEAR)

internal const val ASCENDING = "asc"
internal const val DESCENDING = "desc"
private const val SUBTITLE_SEPARATOR = " · "
private val SHEET_BOTTOM = 30.dp
