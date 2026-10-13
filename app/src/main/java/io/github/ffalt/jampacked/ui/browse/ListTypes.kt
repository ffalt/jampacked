package io.github.ffalt.jampacked.ui.browse

import androidx.annotation.StringRes
import io.github.ffalt.jampacked.R

@StringRes
fun listTypeName(listType: String?): Int? =
    when (listType) {
        "random" -> R.string.random
        "faved" -> R.string.favorite
        "highest" -> R.string.top_rated
        "avghighest" -> R.string.average_top_rated
        "frequent" -> R.string.most_played
        "recent" -> R.string.recently_played
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
