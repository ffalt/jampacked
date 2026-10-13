package io.github.ffalt.jampacked.data.db

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface CacheDao {
    @Query("SELECT * FROM jam WHERE `key` = :key LIMIT 1")
    suspend fun find(key: String): CacheRow?

    @Insert
    suspend fun insert(row: CacheRow)

    @Query("DELETE FROM jam WHERE `key` = :key")
    suspend fun delete(key: String)

    @Query("DELETE FROM jam WHERE `key` LIKE :prefix || '%'")
    suspend fun deleteStartingWith(prefix: String)

    @Query("DELETE FROM jam")
    suspend fun clear()
}

@Dao
interface StoreDao {
    @Query("SELECT * FROM store WHERE `key` = :key LIMIT 1")
    suspend fun find(key: String): StoreRow?

    @Insert
    suspend fun insert(row: StoreRow)

    @Query("DELETE FROM store WHERE `key` = :key")
    suspend fun delete(key: String)
}

@Dao
interface PinDao {
    @Query("SELECT * FROM pin")
    suspend fun all(): List<PinRow>

    @Query("SELECT * FROM pin WHERE `key` = :key LIMIT 1")
    suspend fun find(key: String): PinRow?

    @Insert
    suspend fun insert(row: PinRow)

    @Query("DELETE FROM pin WHERE `key` = :key")
    suspend fun delete(key: String)

    @Query("DELETE FROM pin")
    suspend fun clear()

    @Insert
    suspend fun insertTracks(rows: List<PinTrackRow>)

    @Query("DELETE FROM pin_track WHERE pinKey = :pinKey")
    suspend fun deleteTracks(pinKey: String)

    @Query("DELETE FROM pin_track")
    suspend fun clearTracks()

    @Query("SELECT COUNT(*) FROM pin")
    suspend fun countPins(): Int

    @Query("SELECT EXISTS(SELECT 1 FROM pin_track WHERE trackId = :trackId)")
    suspend fun isTrackPinned(trackId: String): Boolean

    @Query(
        """
		SELECT trackId FROM pin_track
		WHERE pinKey = :pinKey
		  AND trackId NOT IN (SELECT trackId FROM pin_track WHERE pinKey != :pinKey)
		"""
    )
    suspend fun exclusiveTrackIds(pinKey: String): List<String>
}
