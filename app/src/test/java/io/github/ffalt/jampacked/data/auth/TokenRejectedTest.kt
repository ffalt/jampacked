package io.github.ffalt.jampacked.data.auth

import org.junit.Assert.assertEquals
import org.junit.Test

class TokenRejectedTest {
    @Test
    fun `an http 401 rejects the token, since apollo never parses that body`() {
        assertEquals(true, tokenRejected(httpStatusCode = 401, errorCodes = emptyList()))
    }

    @Test
    fun `the servers UNAUTHENTICATED code rejects the token`() {
        assertEquals(true, tokenRejected(httpStatusCode = null, errorCodes = listOf("UNAUTHENTICATED")))
    }

    @Test
    fun `either signal alone is enough, so one of them going missing still logs out`() {
        assertEquals(true, tokenRejected(httpStatusCode = 401, errorCodes = listOf("UNAUTHENTICATED")))
    }

    @Test
    fun `a server that is merely broken keeps the session`() {
        assertEquals(false, tokenRejected(httpStatusCode = 500, errorCodes = listOf("INTERNAL_SERVER_ERROR")))
    }

    @Test
    fun `being refused a role is not the same as being logged out`() {
        assertEquals(false, tokenRejected(httpStatusCode = 403, errorCodes = listOf("FORBIDDEN")))
    }

    @Test
    fun `a clean response keeps the session`() {
        assertEquals(false, tokenRejected(httpStatusCode = null, errorCodes = emptyList()))
    }
}
