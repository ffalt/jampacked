package io.github.ffalt.jampacked.ui.browse

import androidx.lifecycle.SavedStateHandle
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.repo.ArtistRepository
import io.github.ffalt.jampacked.data.repo.BrowseIndexGroup
import io.github.ffalt.jampacked.data.repo.BrowsePage
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.flow.update
import javax.inject.Inject

@HiltViewModel
class ArtistListViewModel
    @Inject
    constructor(
        private val repository: ArtistRepository,
        savedStateHandle: SavedStateHandle
    ) : BrowseListViewModel() {
        private val route: Route.ArtistList = savedStateHandle.toRoute<Route.ArtistList>()

        override val isIndexMode: Boolean = route.listType == null

        init {
            uiState.update {
                it.copy(title = "Artists", listType = route.listType)
            }
            load()
        }

        override suspend fun loadIndex(forceRefresh: Boolean): Result<List<BrowseIndexGroup>> =
            repository.index(forceRefresh).map { it.groups }

        override suspend fun loadPage(
            skip: Int,
            take: Int
        ): Result<BrowsePage> = repository.list(route.listType, skip, take)
    }
