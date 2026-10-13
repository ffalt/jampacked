package io.github.ffalt.jampacked.data.repo

fun albumEntryDescription(
    seriesNr: String?,
    year: Int?
): String =
    when {
        !seriesNr.isNullOrEmpty() -> "Episode $seriesNr"
        year != null && year > 0 -> year.toString()
        else -> ""
    }

fun browseSections(
    albums: List<BrowseEntry>,
    types: List<String?>
): List<BrowseSection> {
    val order = LinkedHashMap<String, MutableList<BrowseEntry>>()
    albums.forEachIndexed { index, album ->
        val title = types.getOrNull(index).orEmpty()
        order.getOrPut(title) { mutableListOf() }.add(album)
    }
    return order.map { (title, items) -> BrowseSection(title, items) }
}
