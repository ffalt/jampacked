package io.github.ffalt.jampacked.ui.browse

fun listTypeName(listType: String?): String? =
    when (listType) {
        "random" -> "Random"
        "faved" -> "Favorite"
        "highest" -> "Top Rated"
        "avghighest" -> "Avg. Top Rated"
        "frequent" -> "Most Played"
        "recent" -> "Recently Played"
        else -> null
    }

val browseListTypes: List<String?> =
    listOf(
        null,
        "faved",
        "recent",
        "frequent",
        "random",
        "highest",
        "avghighest"
    )

val trackListTypes: List<String?> = browseListTypes.drop(1)

fun siblingListType(
    order: List<String?>,
    listType: String?,
    step: Int
): String? {
    val index = order.indexOf(listType)
    if (index < 0) return null
    return order.getOrNull(index + step)
}
