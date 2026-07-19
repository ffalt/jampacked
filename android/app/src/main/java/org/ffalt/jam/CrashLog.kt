package org.ffalt.jam

import android.content.Context
import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** Shared crash log file used by both the JS global handler and the native uncaught handler. */
object CrashLog {
  private const val FILE_NAME = "crash.log"
  private const val MAX_BYTES = 512 * 1024 // keep the file bounded so it stays sendable

  fun file(context: Context): File {
    val dir = context.getExternalFilesDir(null) ?: context.filesDir
    return File(dir, FILE_NAME)
  }

  @Synchronized
  fun append(context: Context, source: String, text: String) {
    try {
      val f = file(context)
      if (f.exists() && f.length() > MAX_BYTES) {
        f.delete()
      }
      val timestamp = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US).format(Date())
      f.appendText("===== $source $timestamp =====\n$text\n\n")
    } catch (_: Throwable) {
      // never let logging crash the crash handler
    }
  }
}
