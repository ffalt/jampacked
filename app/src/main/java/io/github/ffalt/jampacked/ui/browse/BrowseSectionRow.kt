package io.github.ffalt.jampacked.ui.browse

import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource
import io.github.ffalt.jampacked.data.repo.BrowseEntry
import io.github.ffalt.jampacked.data.repo.BrowseSection
import io.github.ffalt.jampacked.ui.nav.albumTypeLabelRes

sealed interface BrowseSectionRow {
    data class Heading(
        val title: String
    ) : BrowseSectionRow

    data class Album(
        val entry: BrowseEntry
    ) : BrowseSectionRow
}

fun browseRows(
    sections: List<BrowseSection>,
    headings: Boolean
): List<BrowseSectionRow> =
    buildList {
        sections.forEach { section ->
            if (headings) add(BrowseSectionRow.Heading(section.title))
            section.items.forEach { add(BrowseSectionRow.Album(it)) }
        }
    }

@Composable
fun albumTypeLabel(albumType: String): String =
    albumTypeLabelRes(albumType)?.let { stringResource(it) }
        ?: albumType.replaceFirstChar { it.uppercase() }
