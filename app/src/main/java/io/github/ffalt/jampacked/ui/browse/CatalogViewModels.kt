package io.github.ffalt.jampacked.ui.browse

import android.content.Context
import androidx.lifecycle.SavedStateHandle
import androidx.navigation.toRoute
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import io.github.ffalt.jampacked.R
import io.github.ffalt.jampacked.data.repo.BrowseIndexGroup
import io.github.ffalt.jampacked.data.repo.BrowsePage
import io.github.ffalt.jampacked.data.repo.CatalogRepository
import io.github.ffalt.jampacked.ui.nav.Route
import kotlinx.coroutines.flow.update
import javax.inject.Inject

@HiltViewModel
class GenreListViewModel
    @Inject
    constructor(
        private val repository: CatalogRepository,
        @ApplicationContext context: Context
    ) : BrowseListViewModel(context) {
        override val isIndexMode: Boolean = true

        init {
            uiState.update { it.copy(title = context.getString(R.string.genres)) }
            load()
        }

        override suspend fun loadIndex(forceRefresh: Boolean): Result<List<BrowseIndexGroup>> =
            repository.genreIndex(forceRefresh).map { it.groups }

        override suspend fun loadPage(
            skip: Int,
            take: Int
        ): Result<BrowsePage> = Result.success(BrowsePage())
    }

@HiltViewModel
class SeriesListViewModel
    @Inject
    constructor(
        private val repository: CatalogRepository,
        savedStateHandle: SavedStateHandle,
        @ApplicationContext context: Context
    ) : BrowseListViewModel(context) {
        private val route: Route.SeriesList = savedStateHandle.toRoute<Route.SeriesList>()

        override val isIndexMode: Boolean = route.listType == null

        init {
            uiState.update { it.copy(title = context.getString(R.string.series), listType = route.listType) }
            load()
        }

        override suspend fun loadIndex(forceRefresh: Boolean): Result<List<BrowseIndexGroup>> =
            repository.seriesIndex(forceRefresh).map { it.groups }

        override suspend fun loadPage(
            skip: Int,
            take: Int
        ): Result<BrowsePage> = repository.seriesList(route.listType, skip, take)
    }

@HiltViewModel
class PlaylistListViewModel
    @Inject
    constructor(
        private val repository: CatalogRepository,
        @ApplicationContext context: Context
    ) : BrowseListViewModel(context) {
        override val isIndexMode: Boolean = false

        init {
            uiState.update { it.copy(title = context.getString(R.string.playlists)) }
            load()
        }

        override suspend fun loadIndex(forceRefresh: Boolean): Result<List<BrowseIndexGroup>> = Result.success(emptyList())

        override suspend fun loadPage(
            skip: Int,
            take: Int
        ): Result<BrowsePage> =

            if (skip > 0) {
                Result.success(BrowsePage())
            } else {
                repository.playlistIndex().map { BrowsePage(it, it.size, 0, it.size) }
            }
    }

@HiltViewModel
class PodcastListViewModel
    @Inject
    constructor(
        private val repository: CatalogRepository,
        @ApplicationContext context: Context
    ) : BrowseListViewModel(context) {
        override val isIndexMode: Boolean = false

        init {
            uiState.update { it.copy(title = context.getString(R.string.podcasts)) }
            load()
        }

        override suspend fun loadIndex(forceRefresh: Boolean): Result<List<BrowseIndexGroup>> = Result.success(emptyList())

        override suspend fun loadPage(
            skip: Int,
            take: Int
        ): Result<BrowsePage> =
            if (skip > 0) {
                Result.success(BrowsePage())
            } else {
                repository.podcastIndex().map { BrowsePage(it, it.size, 0, it.size) }
            }
    }
