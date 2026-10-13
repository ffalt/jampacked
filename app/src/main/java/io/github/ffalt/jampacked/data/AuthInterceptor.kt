package io.github.ffalt.jampacked.data

import io.github.ffalt.jampacked.data.auth.AuthRepository
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthInterceptor
    @Inject
    constructor(
        private val auth: AuthRepository
    ) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): Response {
            val token =
                auth.session?.token
                    ?: return chain.proceed(chain.request())
            return chain.proceed(
                chain
                    .request()
                    .newBuilder()
                    .header("Authorization", "Bearer $token")
                    .build()
            )
        }
    }
