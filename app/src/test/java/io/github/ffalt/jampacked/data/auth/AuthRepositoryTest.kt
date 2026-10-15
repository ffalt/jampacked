package io.github.ffalt.jampacked.data.auth

import io.github.ffalt.jampacked.data.JamApi
import io.github.ffalt.jampacked.data.JamSession
import io.github.ffalt.jampacked.data.UserRoles
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class FakeCurrentUserSource : CurrentUserSource {
    var next: CurrentUser = CurrentUser.Unreachable(IllegalStateException("not set"))

    override suspend fun fetch(): CurrentUser = next
}

class FakeAuthStore : AuthStore {
    var stored: JamSession? = null

    override fun load(): JamSession? = stored

    override fun save(session: JamSession) {
        stored = session
    }

    override fun clear() {
        stored = null
    }
}

class AuthRepositoryTest {
    private lateinit var api: JamApi
    private lateinit var store: FakeAuthStore
    private lateinit var currentUser: FakeCurrentUserSource
    private lateinit var repo: AuthRepository

    private val roles = UserRoles(stream = true, admin = true)

    private val session =
        JamSession(
            server = "http://host:4040",
            token = "token-1",
            userId = "u1",
            userName = "admin",
            roles = roles
        )

    @Before
    fun setUp() {
        api = mockk()
        store = FakeAuthStore()
        currentUser = FakeCurrentUserSource()
        repo = AuthRepository(api, store, currentUser)
    }

    @Test
    fun `starts Unknown so the app can show a loading screen`() {
        assertEquals(AuthState.Unknown, repo.state.value)
        assertNull(repo.session)
    }

    @Test
    fun `load with no stored session goes to LoggedOut`() {
        repo.load()
        assertEquals(AuthState.LoggedOut, repo.state.value)
    }

    @Test
    fun `load restores a stored session`() {
        store.stored = session
        repo.load()
        assertEquals(AuthState.LoggedIn(session), repo.state.value)
        assertEquals(session, repo.session)
    }

    @Test
    fun `successful login persists the session and flips state`() =
        runTest {
            coEvery { api.login(any(), any(), any()) } returns session

            val result = repo.login("http://host:4040", "admin", "admin")

            assertTrue(result.isSuccess)
            assertEquals(session, store.stored)
            assertEquals(AuthState.LoggedIn(session), repo.state.value)
        }

    @Test
    fun `login trims a trailing slash off the server url`() =
        runTest {
            coEvery { api.login("http://host:4040", any(), any()) } returns session

            val result = repo.login("http://host:4040/", "admin", "admin")

            assertTrue(result.isSuccess)
        }

    @Test
    fun `failed login leaves the user logged out and stores nothing`() =
        runTest {
            coEvery { api.login(any(), any(), any()) } throws IllegalStateException("HTTP 401")
            repo.load()

            val result = repo.login("http://host:4040", "admin", "nope")

            assertTrue(result.isFailure)
            assertNull(store.stored)
            assertEquals(AuthState.LoggedOut, repo.state.value)
        }

    @Test
    fun `logout clears storage and state`() =
        runTest {
            coEvery { api.login(any(), any(), any()) } returns session
            repo.login("http://host:4040", "admin", "admin")

            repo.logout()

            assertNull(store.stored)
            assertEquals(AuthState.LoggedOut, repo.state.value)
        }

    @Test
    fun `check logs out when the server rejects the token`() =
        runTest {
            store.stored = session
            repo.load()
            currentUser.next = CurrentUser.TokenRejected

            repo.check()

            assertEquals(AuthState.LoggedOut, repo.state.value)
            assertNull(store.stored)
        }

    @Test
    fun `check keeps the session when the server accepts the token`() =
        runTest {
            store.stored = session
            repo.load()
            currentUser.next = CurrentUser.Known(roles)

            repo.check()

            assertEquals(AuthState.LoggedIn(session), repo.state.value)
        }

    @Test
    fun `check keeps the session when the network fails, so offline still works`() =
        runTest {
            store.stored = session
            repo.load()
            currentUser.next = CurrentUser.Unreachable(java.io.IOException("offline"))

            val result = repo.check()

            assertTrue(result.isFailure)
            assertEquals(
                "must not log out on a network error",
                AuthState.LoggedIn(session),
                repo.state.value
            )
            assertEquals(session, store.stored)
        }

    @Test
    fun `check is a no-op when logged out`() =
        runTest {
            repo.load()
            val result = repo.check()
            assertTrue(result.isSuccess)
            assertFalse(repo.state.value is AuthState.LoggedIn)
        }

    @Test
    fun `check takes the roles the server reports`() =
        runTest {
            store.stored = session.copy(roles = UserRoles())
            repo.load()
            currentUser.next = CurrentUser.Known(roles)

            repo.check()

            assertEquals(roles, (repo.state.value as AuthState.LoggedIn).session.roles)
            assertEquals(roles, store.stored?.roles)
        }
}
