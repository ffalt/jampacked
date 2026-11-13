package io.github.ffalt.jampacked.ui.settings

import androidx.media3.common.util.UnstableApi
import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.DownloadRulesRepository
import io.github.ffalt.jampacked.data.PinRepository
import io.github.ffalt.jampacked.data.PinStat
import io.github.ffalt.jampacked.data.StreamSettingsRepository
import io.github.ffalt.jampacked.data.ThemeRepository
import io.github.ffalt.jampacked.data.auth.AuthRepository
import io.github.ffalt.jampacked.data.cache.ImageCache
import io.github.ffalt.jampacked.data.cache.QueryCache
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Before
import org.junit.Test

@UnstableApi
@OptIn(ExperimentalCoroutinesApi::class)
class SettingsViewModelTest {
    private val testDispatcher = StandardTestDispatcher()
    private val themes: ThemeRepository = mockk(relaxed = true)
    private val auth: AuthRepository = mockk(relaxed = true)
    private val queryCache: QueryCache = mockk(relaxed = true)
    private val imageCache: ImageCache = mockk(relaxed = true)
    private val apollo: ApolloProvider = mockk(relaxed = true)
    private val pins: PinRepository = mockk(relaxed = true)
    private val streams: StreamSettingsRepository = mockk(relaxed = true)
    private val downloadRules: DownloadRulesRepository = mockk(relaxed = true)

    private lateinit var viewModel: SettingsViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        coEvery { pins.stat() } returns PinStat(0, 0L)
        coEvery { pins.count() } returns 0

        viewModel =
            SettingsViewModel(
                themes = themes,
                auth = auth,
                cache = queryCache,
                imageCache = imageCache,
                apollo = apollo,
                pins = pins,
                streams = streams,
                downloadRules = downloadRules
            )
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `clearDataCache clears query cache`() =
        runTest {
            viewModel.clearDataCache()
            testDispatcher.scheduler.advanceUntilIdle()

            coVerify(exactly = 1) { queryCache.clear() }
            coVerify(exactly = 0) { imageCache.clear() }
        }

    @Test
    fun `clearImageCache clears image cache`() =
        runTest {
            viewModel.clearImageCache()
            testDispatcher.scheduler.advanceUntilIdle()

            coVerify(exactly = 1) { imageCache.clear() }
            coVerify(exactly = 0) { queryCache.clear() }
        }
}
