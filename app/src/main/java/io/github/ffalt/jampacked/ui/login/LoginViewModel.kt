package io.github.ffalt.jampacked.ui.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.ffalt.jampacked.BuildConfig
import io.github.ffalt.jampacked.data.auth.AuthRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class LoginUiState(
    val server: String = if (BuildConfig.DEBUG) "http://10.0.2.2:4040" else "",
    val username: String = if (BuildConfig.DEBUG) "admin" else "",
    val password: String = if (BuildConfig.DEBUG) "admin" else "",
    val busy: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class LoginViewModel
    @Inject
    constructor(
        private val auth: AuthRepository
    ) : ViewModel() {
        private val uiState = MutableStateFlow(LoginUiState())
        val state: StateFlow<LoginUiState> = uiState.asStateFlow()

        fun onServer(value: String) {
            uiState.value = uiState.value.copy(server = value)
        }

        fun onUsername(value: String) {
            uiState.value = uiState.value.copy(username = value)
        }

        fun onPassword(value: String) {
            uiState.value = uiState.value.copy(password = value)
        }

        fun login() {
            val current = uiState.value
            if (current.busy) return
            uiState.value = current.copy(busy = true, error = null)
            viewModelScope.launch {
                auth
                    .login(current.server, current.username, current.password)
                    .onSuccess { uiState.value = uiState.value.copy(busy = false) }
                    .onFailure { error ->
                        uiState.value =
                            uiState.value.copy(busy = false, error = error.message ?: "Login failed")
                    }
            }
        }
    }
