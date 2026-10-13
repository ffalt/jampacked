package io.github.ffalt.jampacked.data.db

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(tableName = "jam")
data class CacheRow(
    @PrimaryKey(autoGenerate = true) @ColumnInfo(name = "_id") val id: Long = 0,
    @ColumnInfo(name = "key") val key: String,
    @ColumnInfo(name = "data") val data: String,
    @ColumnInfo(name = "date") val date: Long,
    @ColumnInfo(name = "version") val version: Int
)

@Entity(tableName = "store")
data class StoreRow(
    @PrimaryKey(autoGenerate = true) @ColumnInfo(name = "_id") val id: Long = 0,
    @ColumnInfo(name = "key") val key: String,
    @ColumnInfo(name = "data") val data: String,
    @ColumnInfo(name = "date") val date: Long,
    @ColumnInfo(name = "version") val version: Int
)

@Entity(tableName = "pin")
data class PinRow(
    @PrimaryKey(autoGenerate = true) @ColumnInfo(name = "_id") val id: Long = 0,
    @ColumnInfo(name = "key") val key: String,
    @ColumnInfo(name = "data") val data: String,
    @ColumnInfo(name = "date") val date: Long,
    @ColumnInfo(name = "version") val version: Int
)

@Entity(
    tableName = "pin_track",
    primaryKeys = ["pinKey", "trackId"],
    indices = [Index("trackId")]
)
data class PinTrackRow(
    @ColumnInfo(name = "pinKey") val pinKey: String,
    @ColumnInfo(name = "trackId") val trackId: String
)
