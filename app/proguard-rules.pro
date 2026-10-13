# JamPacked R8 rules.
#
# --- kotlinx.serialization -------------------------------------------------
# Serializers are generated as companions and looked up reflectively by the
# `serializer<T>()` calls in the repositories.
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.**
-keepclassmembers class kotlinx.serialization.json.** {
    *** Companion;
}
-keepclasseswithmembers class kotlinx.serialization.json.** {
    kotlinx.serialization.KSerializer serializer(...);
}
-keep,includedescriptorclasses class io.github.ffalt.jampacked.**$$serializer { *; }
-keepclassmembers class io.github.ffalt.jampacked.** {
    *** Companion;
}
-keepclasseswithmembers class io.github.ffalt.jampacked.** {
    kotlinx.serialization.KSerializer serializer(...);
}

# --- Apollo Kotlin ---------------------------------------------------------
-keep class com.apollographql.apollo.api.** { *; }
-keep class io.github.ffalt.jampacked.graphql.** { *; }

# --- Room ------------------------------------------------------------------
-keep class * extends androidx.room.RoomDatabase
-dontwarn androidx.room.paging.**

# --- Media3 ----------------------------------------------------------------
# DownloadService and MediaSessionService are instantiated by the framework
# from the manifest.
-keep class io.github.ffalt.jampacked.player.PlaybackService { *; }
-keep class io.github.ffalt.jampacked.player.JamDownloadService { *; }
-dontwarn androidx.media3.**

# --- OkHttp / Okio ---------------------------------------------------------
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**

# --- Hilt / Dagger ---------------------------------------------------------
-dontwarn dagger.hilt.**

# --- Coroutines ------------------------------------------------------------
-dontwarn kotlinx.coroutines.**
