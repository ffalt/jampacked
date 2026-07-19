import { type TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
	writeCrashLog(text: string): boolean;
	getCrashLogPath(): string;
}

export default TurboModuleRegistry.get<Spec>('NativeCrashReporter');
