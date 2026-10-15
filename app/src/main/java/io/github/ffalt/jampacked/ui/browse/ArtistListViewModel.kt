package io.github.ffalt.jampacked.ui.browse

import android.content.Context
import androidx.lifecycle.SavedStateHandle
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.BrowseSortRepository
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
        savedStateHandle: SavedStateHandle,
        sorts: BrowseSortRepository,
        @ApplicationContext context: Context
    ) : BrowseListViewModel(context, sorts) {
        private val route: Route.ArtistList = savedStateHandle.toRoute<Route.ArtistList>()

        override val hasIndex: Boolean = route.listType == null

        override val sorting: BrowseSorting? =
            BrowseSorting(BrowseSortKind.ARTIST, "artist").takeIf { route.listType == null }

        init {
            uiState.update {
                it.copy(title = context.getString(R.string.artists), listType = route.listType)
            }
            load()
        }

        override suspend fun loadIndex(forceRefresh: Boolean): Result<List<BrowseIndexGroup>> =
            repository.index(forceRefresh).map { it.groups }

        override suspend fun loadPage(
            skip: Int,
            take: Int
        ): Result<BrowsePage> = repository.list(route.listType, skip, take, sort = querySort)
    }
