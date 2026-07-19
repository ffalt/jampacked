package org.ffalt.jam

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import org.ffalt.jam.specs.NativeCrashReporterSpec

@ReactModule(name = NativeCrashReporterModule.NAME)
class NativeCrashReporterModule(reactContext: ReactApplicationContext) :
  NativeCrashReporterSpec(reactContext) {

  override fun getName(): String = NAME

  override fun writeCrashLog(text: String): Boolean {
    CrashLog.append(reactApplicationContext, "JS", text)
    return true
  }

  override fun getCrashLogPath(): String = CrashLog.file(reactApplicationContext).absolutePath

  companion object {
    const val NAME = "NativeCrashReporter"
  }
}
