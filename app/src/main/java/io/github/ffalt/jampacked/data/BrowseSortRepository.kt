package io.github.ffalt.jampacked.data

import io.github.ffalt.jampacked.data.repo.BrowseSort
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BrowseSortRepository
    @Inject
    constructor(
        private val store: SettingsRepository
    ) {
        suspend fun load(listKey: String): BrowseSort = BrowseSort.parse(store.getSetting(settingKey(listKey)))

        suspend fun save(
            listKey: String,
            sort: BrowseSort
        ) {
            store.setSetting(settingKey(listKey), if (sort.isDefault) null else sort.stored())
        }

        private fun settingKey(listKey: String): String = "browse_sort:$listKey"
    }
