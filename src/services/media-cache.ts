import {TrackEntry} from './types';
import dataService from './data';
import {AudioFormatType} from './jam';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFS from 'react-native-fs';

export class MediaCache {

	async init(): Promise<void> {
		const lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
		for (const task of lostTasks) {
			console.log(`Task ${task.id} was found!`);
			task.begin((expectedBytes) => {
				console.log(task.id, `Going to download ${expectedBytes} bytes!`);
			}).progress((percent) => {
				console.log(task.id, `Downloaded: ${percent * 100}%`);
			}).done(() => {
				console.log(task.id, 'Download is done!');
			}).error((error) => {
				console.log(task.id, 'Download canceled due to error: ', error);
			});
		}
	}

	async isDownloaded(id: string): Promise<boolean> {
		return await RNFS.exists(this.pathInCache(id));
	}

	pathInCache(id: string): string {
		return `${RNBackgroundDownloader.directories.documents}/${id}.mp3`;
	}

	async download(tracks: Array<TrackEntry>): Promise<void> {
		const headers = dataService.currentUserToken ? {Authorization: `Bearer ${dataService.currentUserToken}`} : undefined;
		for (const t of tracks) {
			if (!await this.isDownloaded(t.id)) {
				const task = RNBackgroundDownloader.download({
					id: t.id,
					url: dataService.jam.stream.streamUrl({id: t.id, format: AudioFormatType.mp3}, !headers),
					destination: this.pathInCache(t.id),
					headers
				})
					.begin((expectedBytes) => {
						console.log(task.id, `Going to download ${expectedBytes} bytes!`);
					}).progress((percent) => {
						console.log(task.id, `Downloaded: ${percent * 100}%`);
					}).done(() => {
						console.log(task.id, 'Download is done!');
					}).error((error) => {
						console.log(task.id, 'Download canceled due to error: ', error);
					});
				task.resume();
			}
		}

		/*

		let task = RNBackgroundDownloader.download({
	id: 'file123',
	url: 'https://link-to-very.large/file.zip'
	destination: `${RNBackgroundDownloader.directories.documents}/file.zip`,
	headers: {
	    Authorization: 'Bearer 2we$@$@Ddd223'
	}
}).begin((expectedBytes) => {
	console.log(`Going to download ${expectedBytes} bytes!`);
}).progress((percent) => {
	console.log(`Downloaded: ${percent * 100}%`);
}).done(() => {
	console.log('Download is done!');
}).error((error) => {
	console.log('Download canceled due to error: ', error);
});
		 */
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
