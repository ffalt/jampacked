package io.github.ffalt.jampacked.data.auth

import com.apollographql.apollo.api.ApolloResponse
import com.apollographql.apollo.exception.ApolloHttpException
import io.github.ffalt.jampacked.data.ApolloProvider
import io.github.ffalt.jampacked.data.UserRoles
import io.github.ffalt.jampacked.graphql.CurrentUserResultQuery
import io.github.ffalt.jampacked.graphql.type.UserRole
import javax.inject.Inject
import javax.inject.Provider
import javax.inject.Singleton

@Singleton
class ApolloCurrentUserSource
    @Inject
    constructor(
        // ApolloProvider reads the token off AuthRepository, which owns this source.
        private val apollo: Provider<ApolloProvider>
    ) : CurrentUserSource {
        override suspend fun fetch(): CurrentUser {
            val response =
                runCatching {
                    apollo
                        .get()
                        .client()
                        .query(CurrentUserResultQuery())
                        .execute()
                }.getOrElse { return CurrentUser.Unreachable(it) }

            if (response.rejectedTheToken()) return CurrentUser.TokenRejected

            val user =
                response.data?.currentUser
                    ?: return CurrentUser.Unreachable(
                        response.exception ?: IllegalStateException(response.firstErrorMessage())
                    )
            return CurrentUser.Known(user.roles.toUserRoles())
        }
    }

private fun ApolloResponse<*>.rejectedTheToken(): Boolean =
    tokenRejected(
        httpStatusCode = (exception as? ApolloHttpException)?.statusCode,
        errorCodes = errors.orEmpty().map { it.extensions?.get("code") }
    )

/**
 * Apollo surfaces an HTTP 401 as an exception without parsing the body, so the
 * status and the error code have to be read as separate signals.
 */
internal fun tokenRejected(
    httpStatusCode: Int?,
    errorCodes: List<Any?>
): Boolean = httpStatusCode == HTTP_UNAUTHORIZED || errorCodes.any { it == UNAUTHENTICATED_CODE }

private fun ApolloResponse<*>.firstErrorMessage(): String = errors?.firstOrNull()?.message ?: "No data"

private fun List<UserRole>.toUserRoles(): UserRoles =
    UserRoles(
        stream = UserRole.stream in this,
        podcast = UserRole.podcast in this,
        upload = UserRole.upload in this,
        admin = UserRole.admin in this
    )

private const val UNAUTHENTICATED_CODE = "UNAUTHENTICATED"
private const val HTTP_UNAUTHORIZED = 401
