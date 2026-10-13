package io.github.ffalt.jampacked.util

import android.content.Context
import android.os.Build
import io.github.ffalt.jampacked.BuildConfig
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object CrashLog {
    private const val FILE_NAME = "crash.log"
    private const val MAX_BYTES = 512 * 1024

    fun file(context: Context): File {
        val dir = context.getExternalFilesDir(null) ?: context.filesDir
        return File(dir, FILE_NAME)
    }

    @Synchronized
    fun append(
        context: Context,
        source: String,
        text: String
    ) {
        try {
            val f = file(context)
            if (f.exists() && f.length() > MAX_BYTES) {
                f.delete()
            }
            val timestamp = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date())
            f.appendText("===== $source $timestamp =====\n$text\n\n")
        } catch (_: Throwable) {
        }
    }

    fun install(context: Context) {
        val previous = Thread.getDefaultUncaughtExceptionHandler()
        Thread.setDefaultUncaughtExceptionHandler { thread, error ->
            append(context, "uncaught", describe(error, thread.name))
            previous?.uncaughtException(thread, error)
        }
    }

    private fun describe(
        error: Throwable,
        threadName: String
    ): String =
        buildString {
            appendLine("app: ${BuildConfig.VERSION_NAME}")
            appendLine("android: ${Build.VERSION.SDK_INT} (${Build.MODEL})")
            appendLine("thread: $threadName")
            appendLine("message: ${error.message ?: error.toString()}")
            appendLine("stack:")
            append(error.stackTraceToString())
        }
}
