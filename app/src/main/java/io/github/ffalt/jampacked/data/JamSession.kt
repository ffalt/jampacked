package io.github.ffalt.jampacked.data

import kotlinx.serialization.Serializable

@Serializable
data class UserRoles(
    val stream: Boolean = false,
    val podcast: Boolean = false,
    val upload: Boolean = false,
    val admin: Boolean = false
)

@Serializable
data class JamSession(
    val server: String,
    val token: String,
    val userId: String,
    val userName: String,
    val roles: UserRoles = UserRoles()
) {
    val apiPrefix: String get() = "$server$API"

    fun imageUrl(
        id: String,
        size: Int? = null,
        format: String? = null
    ): String = "$apiPrefix/image/$id" + (size?.let { "_$it" } ?: "") + (format?.let { ".$it" } ?: "")

    fun streamUrl(
        id: String,
        request: StreamRequest = StreamRequest()
    ): String =
        "$apiPrefix/stream/$id" +
            (request.maxBitRate?.let { "_$it" } ?: "") +
            ".${request.extension}"

    fun cacheKey(id: String): String = "$apiPrefix/stream/$id.$MP3_EXTENSION"

    val graphqlUrl: String get() = "$server/graphql"

    companion object {
        const val API = "/jam/v1"
        const val CLIENT_NAME = "JamPacked"
    }
}
