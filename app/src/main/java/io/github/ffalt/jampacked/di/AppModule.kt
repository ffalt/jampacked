package io.github.ffalt.jampacked.di

import android.content.Context
import androidx.room.Room
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import io.github.ffalt.jampacked.data.AuthInterceptor
import io.github.ffalt.jampacked.data.db.CacheDao
import io.github.ffalt.jampacked.data.db.JamDatabase
import io.github.ffalt.jampacked.data.db.PinDao
import io.github.ffalt.jampacked.data.db.StoreDao
import kotlinx.serialization.json.Json
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit
import javax.inject.Qualifier
import javax.inject.Singleton

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class PlainHttp

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun json(): Json =
        Json {
            ignoreUnknownKeys = true
            encodeDefaults = true
        }

    @Provides
    @Singleton
    @PlainHttp
    fun plainHttpClient(): OkHttpClient =
        OkHttpClient
            .Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(10, TimeUnit.SECONDS)
            .build()

    @Provides
    @Singleton
    fun authedHttpClient(
        @PlainHttp base: OkHttpClient,
        interceptor: AuthInterceptor
    ): OkHttpClient = base.newBuilder().addInterceptor(interceptor).build()

    @Provides
    @Singleton
    fun database(
        @ApplicationContext context: Context
    ): JamDatabase =
        Room
            .databaseBuilder(context, JamDatabase::class.java, JamDatabase.NAME)
            .fallbackToDestructiveMigration(dropAllTables = true)
            .build()

    @Provides
    fun cacheDao(db: JamDatabase): CacheDao = db.cacheDao()

    @Provides
    fun storeDao(db: JamDatabase): StoreDao = db.storeDao()

    @Provides
    fun pinDao(db: JamDatabase): PinDao = db.pinDao()
}
