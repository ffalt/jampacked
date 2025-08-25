import Snackbar from 'react-native-snackbar';
import { errorMessage } from '../utils/errors.utils.ts';

export function snackSuccess(text: string): void {
	Snackbar.show({
		text,
		duration: Snackbar.LENGTH_SHORT,
		backgroundColor: 'green',
		textColor: 'white'
	});
}

export function snackFail(text: string): void {
	Snackbar.show({
		text,
		duration: Snackbar.LENGTH_LONG,
		backgroundColor: 'red',
		textColor: 'white'
	});
}

export function snackError(error: unknown): void {
	console.error(error);
	snackFail(errorMessage(error));
}
