package io.github.ffalt.jampacked

import android.app.SearchManager
import android.content.Intent
import android.os.Bundle
import android.provider.MediaStore
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.lifecycleScope
import dagger.hilt.android.AndroidEntryPoint
import io.github.ffalt.jampacked.data.ThemeRepository
import io.github.ffalt.jampacked.data.auth.AuthRepository
import io.github.ffalt.jampacked.data.auth.AuthState
import io.github.ffalt.jampacked.data.repo.SearchRepository
import io.github.ffalt.jampacked.data.repo.TrackRepository
import io.github.ffalt.jampacked.player.PlayerRepository
import io.github.ffalt.jampacked.ui.components.Logo
import io.github.ffalt.jampacked.ui.login.LoginScreen
import io.github.ffalt.jampacked.ui.nav.AppScaffold
import io.github.ffalt.jampacked.ui.nav.DeepLinks
import io.github.ffalt.jampacked.ui.theme.JamTheme
import io.github.ffalt.jampacked.ui.theme.LocalJamColors
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    @Inject
    lateinit var auth: AuthRepository

    @Inject
    lateinit var themes: ThemeRepository

    @Inject
    lateinit var search: SearchRepository

    @Inject
    lateinit var tracks: TrackRepository

    @Inject
    lateinit var player: PlayerRepository

    private val openPlayer = Channel<Unit>(Channel.CONFLATED)

    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        if (savedInstanceState == null) handleDeepLink(intent)
        setContent {
            val themeName by themes.theme.collectAsStateWithLifecycle()
            JamTheme(themeName = themeName) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = LocalJamColors.current.background
                ) { Root() }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleDeepLink(intent)
    }

    private fun handleDeepLink(intent: Intent?) {
        if (intent?.action == MediaStore.INTENT_ACTION_MEDIA_PLAY_FROM_SEARCH) {
            playFromSearch(intent.getStringExtra(SearchManager.QUERY).orEmpty())
            return
        }
        val uri = intent?.data ?: return
        if (intent.action == Intent.ACTION_VIEW && uri.toString() == DeepLinks.PLAYER) {
            openPlayer.trySend(Unit)
        }
    }

    private fun playFromSearch(query: String) {
        if (query.isBlank()) {
            openPlayer.trySend(Unit)
            return
        }
        lifecycleScope.launch {
            auth.state.first { it is AuthState.LoggedIn }
            val hits =
                search
                    .searchKind(query, "track", PLAY_FROM_SEARCH_TAKE, 0)
                    .getOrNull()
                    ?.hits
                    .orEmpty()
            val entries = hits.mapNotNull { tracks.track(it.id).getOrNull() }
            if (entries.isEmpty()) return@launch
            player.awaitConnected()
            player.playTracks(entries)
            openPlayer.trySend(Unit)
        }
    }

    @Composable
    private fun Root(modifier: Modifier = Modifier) {
        val state by auth.state.collectAsStateWithLifecycle()
        when (val current = state) {
            AuthState.Unknown -> {
                Box(
                    modifier = modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) { Logo(size = LOADING_LOGO) }
            }

            AuthState.LoggedOut -> {
                LoginScreen(modifier = modifier)
            }

            is AuthState.LoggedIn -> {
                AppScaffold(
                    session = current.session,
                    openPlayerRequests = openPlayer.receiveAsFlow(),
                    modifier = modifier
                )
            }
        }
    }
}

private val LOADING_LOGO = 104.dp
private const val PLAY_FROM_SEARCH_TAKE = 20
