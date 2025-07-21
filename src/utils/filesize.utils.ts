// https://stackoverflow.com/a/34210131
const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function humanFileSize(bytes: number): string {
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	if (!bytes) {
		return '0 Bytes';
	} else {
		return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sufixes[i];
	}
}
