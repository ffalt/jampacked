package io.github.ffalt.jampacked.data.repo

import kotlinx.serialization.Serializable

@Serializable
data class HomeEntry(
    val id: String,
    val name: String,
    val kind: String
)

@Serializable
data class HomeStat(
    val title: String,
    val icon: String,
    val value: Int,
    val routeKey: String
)

@Serializable
data class HomeSections(
    val albumsRecent: List<HomeEntry> = emptyList(),
    val artistsRecent: List<HomeEntry> = emptyList(),
    val albumsFaved: List<HomeEntry> = emptyList(),
    val artistsFaved: List<HomeEntry> = emptyList()
)

@Serializable
data class HomeData(
    val sections: HomeSections = HomeSections(),
    val library: List<HomeStat> = emptyList(),
    val collections: List<HomeStat> = emptyList(),
    val favorites: List<HomeStat> = emptyList(),
    val played: List<HomeStat> = emptyList()
)
