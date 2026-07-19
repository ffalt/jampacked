package org.ffalt.jam

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class CrashReporterPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
    if (name == NativeCrashReporterModule.NAME) NativeCrashReporterModule(reactContext) else null

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
    ReactModuleInfoProvider {
      mapOf(
        NativeCrashReporterModule.NAME to
          ReactModuleInfo(
            NativeCrashReporterModule.NAME,
            NativeCrashReporterModule.NAME,
            false, // canOverrideExistingModule
            false, // needsEagerInit
            false, // isCxxModule
            true // isTurboModule
          )
      )
    }
}
