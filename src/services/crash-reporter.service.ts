import { Platform } from 'react-native';
import NativeCrashReporter from '../../specs/NativeCrashReporter';
import { version as appVersion } from '../../package.json';

interface ErrorUtilsShape {
	getGlobalHandler?: () => (error: unknown, isFatal?: boolean) => void;
	setGlobalHandler: (handler: (error: unknown, isFatal?: boolean) => void) => void;
}

const getErrorUtils = (): ErrorUtilsShape | undefined => (globalThis as { ErrorUtils?: ErrorUtilsShape }).ErrorUtils;

const formatError = (error: unknown, isFatal: boolean): string => {
	const details = error as { message?: string; stack?: string } | undefined;
	return [
		`fatal: ${isFatal}`,
		`app: ${appVersion}`,
		`platform: ${Platform.OS} ${String(Platform.Version)}`,
		`message: ${details?.message ?? String(error)}`,
		`stack:\n${details?.stack ?? '(no stack)'}`
	].join('\n');
};

export const installCrashReporter = (): void => {
	const errorUtils = getErrorUtils();
	if (!errorUtils) {
		return;
	}
	const previous = errorUtils.getGlobalHandler?.();
	errorUtils.setGlobalHandler((error: unknown, isFatal?: boolean): void => {
		try {
			NativeCrashReporter?.writeCrashLog(formatError(error, Boolean(isFatal)));
		} catch {
			// never mask the original crash
		}
		previous?.(error, isFatal);
	});
	const path = NativeCrashReporter?.getCrashLogPath();
	if (path) {
		console.log(`crash reporter installed, log file: ${path}`);
	}
};
