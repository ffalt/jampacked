package io.github.ffalt.jampacked.data.auth

import io.github.ffalt.jampacked.data.JamApi
import io.github.ffalt.jampacked.data.JamSession
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

sealed interface AuthState {
    data object Unknown : AuthState

    data object LoggedOut : AuthState

    data class LoggedIn(
        val session: JamSession
    ) : AuthState
}

@Singleton
class AuthRepository
    @Inject
    constructor(
        private val api: JamApi,
        private val store: AuthStore,
        private val currentUser: CurrentUserSource
    ) {
        private val uiState = MutableStateFlow<AuthState>(AuthState.Unknown)
        val state: StateFlow<AuthState> = uiState.asStateFlow()
        val session: JamSession? get() = (uiState.value as? AuthState.LoggedIn)?.session

        fun load() {
            val stored = store.load()
            uiState.value = if (stored != null) AuthState.LoggedIn(stored) else AuthState.LoggedOut
        }

        suspend fun login(
            server: String,
            username: String,
            password: String
        ): Result<JamSession> =
            runCatching { api.login(server.trimEnd('/'), username, password) }
                .onSuccess {
                    store.save(it)
                    uiState.value = AuthState.LoggedIn(it)
                }

        suspend fun check(): Result<Unit> {
            val current = session ?: return Result.success(Unit)
            return when (val result = currentUser.fetch()) {
                is CurrentUser.TokenRejected -> {
                    logout()
                    Result.success(Unit)
                }

                is CurrentUser.Unreachable -> {
                    Result.failure(result.error)
                }

                is CurrentUser.Known -> {
                    if (result.roles != current.roles) {
                        val refreshed = current.copy(roles = result.roles)
                        store.save(refreshed)
                        uiState.value = AuthState.LoggedIn(refreshed)
                    }
                    Result.success(Unit)
                }
            }
        }

        fun logout() {
            store.clear()
            uiState.value = AuthState.LoggedOut
        }
    }
