package io.github.ffalt.jampacked.ui.browse

import androidx.lifecycle.SavedStateHandle
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.repo.AlbumRepository
import io.github.ffalt.jampacked.data.repo.BrowseIndexGroup
import io.github.ffalt.jampacked.data.repo.BrowsePage
import io.github.ffalt.jampacked.ui.nav.Route
import io.github.ffalt.jampacked.ui.nav.albumTypeLabel
import kotlinx.coroutines.flow.update
import javax.inject.Inject

@HiltViewModel
class AlbumListViewModel
    @Inject
    constructor(
        private val repository: AlbumRepository,
        savedStateHandle: SavedStateHandle
    ) : BrowseListViewModel() {
        private val route: Route.AlbumList = savedStateHandle.toRoute<Route.AlbumList>()

        override val isIndexMode: Boolean = route.listType == null

        init {
            uiState.update { it.copy(title = titleFor(route), listType = route.listType) }
            load()
        }

        override suspend fun loadIndex(forceRefresh: Boolean): Result<List<BrowseIndexGroup>> =
            repository.index(route.albumType, forceRefresh).map { it.groups }

        override suspend fun loadPage(
            skip: Int,
            take: Int
        ): Result<BrowsePage> = repository.list(route.albumType, route.listType, skip, take)

        private fun titleFor(route: Route.AlbumList): String = albumTypeLabel(route.albumType)
    }
