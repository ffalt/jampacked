// https://stackoverflow.com/a/34210131
const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function humanFileSize(bytes: number): string {
	const value = Math.floor(Math.log(bytes) / Math.log(1024));
	return bytes ? `${(bytes / Math.pow(1024, value)).toFixed(2)} ${sufixes[value]}` : '0 Bytes';
}
