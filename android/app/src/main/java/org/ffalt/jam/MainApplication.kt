package org.ffalt.jam;

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import java.io.PrintWriter
import java.io.StringWriter

class MainApplication : Application(), ReactApplication {
 override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          add(CrashReporterPackage())
        },
    )
  }
  override fun onCreate() {
    super.onCreate()
    installNativeCrashHandler()
    loadReactNative(this)
  }

  private fun installNativeCrashHandler() {
    val previous = Thread.getDefaultUncaughtExceptionHandler()
    Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
      val writer = StringWriter()
      throwable.printStackTrace(PrintWriter(writer))
      CrashLog.append(applicationContext, "NATIVE thread=${thread.name}", writer.toString())
      previous?.uncaughtException(thread, throwable)
    }
  }
}
