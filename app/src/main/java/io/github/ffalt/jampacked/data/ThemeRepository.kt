package io.github.ffalt.jampacked.data

import io.github.ffalt.jampacked.ui.theme.JamThemeName
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ThemeRepository
    @Inject
    constructor(
        private val settings: SettingsRepository
    ) {
        private val _theme = MutableStateFlow(JamThemeName.AUTO)
        val theme: StateFlow<JamThemeName> = _theme.asStateFlow()

        suspend fun load() {
            val stored = settings.getSetting(KEY)
            _theme.value = parse(stored)
        }

        suspend fun set(name: JamThemeName) {
            _theme.value = name
            settings.setSetting(KEY, name.name.lowercase())
        }

        private fun parse(value: String?): JamThemeName =
            when (value?.lowercase()) {
                "light" -> JamThemeName.LIGHT
                "dark" -> JamThemeName.DARK
                "black" -> JamThemeName.BLACK
                else -> JamThemeName.AUTO
            }

        private companion object {
            const val KEY = "theme"
        }
    }
