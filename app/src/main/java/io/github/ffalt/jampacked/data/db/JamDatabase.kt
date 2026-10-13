package io.github.ffalt.jampacked.data.db

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [CacheRow::class, StoreRow::class, PinRow::class, PinTrackRow::class],
    version = 2,
    exportSchema = false
)
abstract class JamDatabase : RoomDatabase() {
    abstract fun cacheDao(): CacheDao

    abstract fun storeDao(): StoreDao

    abstract fun pinDao(): PinDao

    companion object {
        const val NAME = "jam.db"
    }
}
