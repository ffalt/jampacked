export function errorMessage(error: unknown): string {
	let message = 'Invalid Server Response';
	if (typeof error === 'string') {
		message = error;
	} else if (
		error !== null && typeof error === 'object' &&
		('error' in error) && error.error !== null &&
		typeof error.error === 'object' &&
		('error' in error.error) &&
		typeof error.error.error === 'string'
	) {
		message = error.error.error;
	} else if (error instanceof Error && error.message) {
		message = error.message;
	}
	if (message.startsWith('Error:')) {
		message = message.slice(6).trim();
	}
	return message;
}
