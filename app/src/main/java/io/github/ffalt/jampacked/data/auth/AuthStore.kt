package io.github.ffalt.jampacked.data.auth

import io.github.ffalt.jampacked.data.JamSession

interface AuthStore {
    fun load(): JamSession?

    fun save(session: JamSession)

    fun clear()
}
