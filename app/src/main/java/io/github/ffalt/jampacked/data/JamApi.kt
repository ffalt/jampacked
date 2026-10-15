package io.github.ffalt.jampacked.data

import io.github.ffalt.jampacked.di.PlainHttp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import javax.inject.Inject
import javax.inject.Singleton

@Serializable
data class SessionUser(
    val id: String,
    val name: String,
    val roles: UserRoles = UserRoles()
)

@Serializable
data class SessionResponse(
    val version: String,
    val jwt: String? = null,
    val user: SessionUser? = null,
    @SerialName("allowedCookieDomains") val allowedCookieDomains: List<String>? = null
)

@Serializable
private data class LoginRequest(
    val client: String,
    val username: String,
    val password: String,
    val jwt: Boolean
)

@Singleton
class JamApi
    @Inject
    constructor(
        @PlainHttp private val http: OkHttpClient
    ) {
        private val json = Json { ignoreUnknownKeys = true }

        suspend fun login(
            server: String,
            username: String,
            password: String
        ): JamSession =
            withContext(Dispatchers.IO) {
                val body =
                    json
                        .encodeToString(
                            LoginRequest(JamSession.CLIENT_NAME, username, password, jwt = true)
                        ).toRequestBody("application/json".toMediaType())

                val request =
                    Request
                        .Builder()
                        .url("$server${JamSession.API}/auth/login")
                        .post(body)
                        .build()

                http.newCall(request).execute().use { response ->
                    val text = response.body.string().orEmpty()
                    if (!response.isSuccessful) {
                        error("Login failed (HTTP ${response.code}): ${text.take(200)}")
                    }
                    val session = json.decodeFromString<SessionResponse>(text)
                    val user = session.user ?: error("Invalid server response: no user")
                    val token = session.jwt ?: error("Invalid server response: no token")
                    JamSession(
                        server = server,
                        token = token,
                        userId = user.id,
                        userName = user.name,
                        roles = user.roles
                    )
                }
            }
    }
