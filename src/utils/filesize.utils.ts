// https://stackoverflow.com/a/34210131
const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function humanFileSize(bytes: number): string {
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return !bytes && '0 Bytes' || (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sufixes[i];
}

//
// export function humanFileSize(bytes: number, si = false, dp = 1): string {
// 	// https://stackoverflow.com/a/14919494
// 	const thresh = si ? 1000 : 1024;
//
// 	if (Math.abs(bytes) < thresh) {
// 		return bytes + ' B';
// 	}
//
// 	const units = si
// 		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
// 		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
// 	let u = -1;
// 	const r = 10 ** dp;
//
// 	do {
// 		bytes /= thresh;
// 		++u;
// 	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
//
//
// 	return bytes.toFixed(dp) + ' ' + units[u];
// }
