package io.github.ffalt.jampacked.data

import io.github.ffalt.jampacked.ui.nav.DEFAULT_NAVIGATION_TRANSITION
import io.github.ffalt.jampacked.ui.nav.NavigationTransition
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class NavigationTransitionRepository
    @Inject
    constructor(
        private val settings: SettingsRepository
    ) {
        private val _transition = MutableStateFlow(DEFAULT_NAVIGATION_TRANSITION)
        val transition: StateFlow<NavigationTransition> = _transition.asStateFlow()

        suspend fun load() {
            _transition.value = parse(settings.getSetting(KEY))
        }

        suspend fun set(transition: NavigationTransition) {
            _transition.value = transition
            settings.setSetting(KEY, transition.name.lowercase())
        }

        private fun parse(value: String?): NavigationTransition =
            NavigationTransition.entries.firstOrNull {
                it.name.equals(value, ignoreCase = true)
            } ?: DEFAULT_NAVIGATION_TRANSITION

        private companion object {
            const val KEY = "navigation_transition"
        }
    }
