package io.github.ffalt.jampacked.ui.home

import androidx.annotation.OptIn
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.media3.common.util.UnstableApi
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.data.PinRepository
import io.github.ffalt.jampacked.data.auth.AuthRepository
import io.github.ffalt.jampacked.data.cache.Resource
import io.github.ffalt.jampacked.data.repo.HomeData
import io.github.ffalt.jampacked.data.repo.HomeRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val loading: Boolean = true,
    val error: String? = null,
    val fromCache: Boolean = false,
    val userName: String = "",
    val userId: String = "",
    val data: HomeData = HomeData(),
    val pinnedCount: Int = 0
)

@HiltViewModel
class HomeViewModel
    @OptIn(UnstableApi::class)
    @Inject
    constructor(
        private val home: HomeRepository,
        private val auth: AuthRepository,
        private val pins: PinRepository
    ) : ViewModel() {
        private val uiState = MutableStateFlow(HomeUiState())
        val state: StateFlow<HomeUiState> = uiState.asStateFlow()

        init {
            load(forceRefresh = false)
        }

        fun load(forceRefresh: Boolean) {
            viewModelScope.launch {
                home.homeData(forceRefresh).collect { resource ->
                    when (resource) {
                        Resource.Loading -> {
                            uiState.update { it.copy(loading = true, error = null) }
                        }

                        is Resource.Success -> {
                            uiState.update {
                                it.copy(
                                    loading = false,
                                    error = null,
                                    fromCache = resource.fromCache,
                                    userName = auth.session?.userName.orEmpty(),
                                    userId = auth.session?.userId.orEmpty(),
                                    data = resource.data
                                )
                            }
                        }

                        is Resource.Failure -> {
                            uiState.update {
                                it.copy(loading = false, error = resource.error.message ?: "Failed to load")
                            }
                        }
                    }
                }
            }
            refreshPinCount()
        }

        @OptIn(UnstableApi::class)
        private fun refreshPinCount() {
            viewModelScope.launch {
                val count = pins.count()
                uiState.update { it.copy(pinnedCount = count) }
            }
        }
    }
