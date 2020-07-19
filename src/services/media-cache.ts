import {TrackEntry} from './types';

export class MediaCache {

	async init(): Promise<void> {
		// const lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
		// for (const task of lostTasks) {
		// 	console.log(`Task ${task.id} was found!`);
		// 	task.progress((percent) => {
		// 		console.log(`Downloaded: ${percent * 100}%`);
		// 	}).done(() => {
		// 		console.log('Downlaod is done!');
		// 	}).error((error) => {
		// 		console.log('Download canceled due to error: ', error);
		// 	});
		// }
	}

	async download(_tracks: Array<TrackEntry>): Promise<void> {
		// let task = RNBackgroundDownloader.download({
		// 	id: 'file123',
		// 	url: 'https://link-to-very.large/file.zip'
		// 	destination: `${RNBackgroundDownloader.directories.documents}/file.zip`
		// }).begin((expectedBytes) => {
		// 	console.log(`Going to download ${expectedBytes} bytes!`);
		// }).progress((percent) => {
		// 	console.log(`Downloaded: ${percent * 100}%`);
		// }).done(() => {
		// 	console.log('Download is done!');
		// }).error((error) => {
		// 	console.log('Download canceled due to error: ', error);
		// });

		// Pause the task
		// 		task.pause();

		// Resume after pause
		// 		task.resume();

		// Cancel the task
		// 		task.stop();
	}

}
