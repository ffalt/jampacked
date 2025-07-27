import Snackbar from 'react-native-snackbar';

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

export function snackError(error: { message: string }): void {
	console.error(error);
	snackFail(error.message);
}
