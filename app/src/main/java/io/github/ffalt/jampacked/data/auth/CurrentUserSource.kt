package io.github.ffalt.jampacked.data.auth

import io.github.ffalt.jampacked.data.UserRoles

sealed interface CurrentUser {
    data class Known(
        val roles: UserRoles
    ) : CurrentUser

    data object TokenRejected : CurrentUser

    data class Unreachable(
        val error: Throwable
    ) : CurrentUser
}

interface CurrentUserSource {
    suspend fun fetch(): CurrentUser
}
