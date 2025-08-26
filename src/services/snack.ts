import { errorMessage } from '../utils/errors.utils.ts';
import { ToastService } from 'react-native-toastier';

export function snackSuccess(text: string): void {
	ToastService.show({
		message: text,
		duration: 5000,
		type: 'success'
	});
}

export function snackFail(text: string): void {
	ToastService.show({
		message: text,
		duration: 15_000,
		type: 'danger'
	});
}

export function snackError(error: unknown): void {
	console.error(error);
	snackFail(errorMessage(error));
}
