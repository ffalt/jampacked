package io.github.ffalt.jampacked.di

import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.github.ffalt.jampacked.data.auth.AuthStore
import io.github.ffalt.jampacked.data.auth.EncryptedAuthStore
import io.github.ffalt.jampacked.data.cache.CacheStore
import io.github.ffalt.jampacked.data.cache.RoomCacheStore
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class BindsModule {
    @Binds
    @Singleton
    abstract fun cacheStore(impl: RoomCacheStore): CacheStore

    @Binds
    @Singleton
    abstract fun authStore(impl: EncryptedAuthStore): AuthStore
}
