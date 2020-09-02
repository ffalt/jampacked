import {TrackEntry} from './types';
import dataService from './data';
import {AudioFormatType} from './jam';
import RNBackgroundDownloader, {DownloadTask} from 'react-native-background-downloader';
import RNFS from 'react-native-fs';
// @ts-ignore
import DownloadNotification from 'react-native-download-notification';


type DNotificationIntentHandler = () => void;

interface DNotification {
	updateProgress(progress: number): void;

	setStateCompleted(): void;

	setStateCancelled(): void;

	setStateFailed(): void;

	setExtraInfo(data: string): void;

	getExtraInfo(): string;

	getId(): string;

	register(intentHandler: DNotificationIntentHandler): void;

	unregister(): void;
}

export class MediaCache {
	tasks: Array<DownloadTask> = [];

	// private notification?: DNotification;

	async init(): Promise<void> {
		const lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
		this.tasks = lostTasks || [];
		await this.start();
	}

	intentHandler(intent: string): void {
		// intent is a String, depending on the notification state could be:
		//   'cancel' if download is on going
		//   'open' if it is set to completed
		//   'dismiss' if the user dismisses it
		if (intent === 'cancel') {
			// a reference of the notification tapped is binded
			// this.setStateCancelled();
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
				});
				task.pause();
				this.tasks.push(task);
			}
		}
		await this.start();
		// .pause();
		// this.connectToTask(task);
		// Pause the task
		// 		task.pause();
		// Resume after pause
		// 		task.resume();
		// Cancel the task
		// 		task.stop();
	}

	private connectToTask(task: DownloadTask, notification: DNotification): void {
		task
			.begin((expectedBytes) => {
				console.log(task.id, `Going to download ${expectedBytes} bytes!`);
				notification.setExtraInfo(`Total: ${expectedBytes}`)
			})
			.progress((percent) => {
				notification.updateProgress(percent * 100);
				console.log(task.id, `Downloaded: ${percent * 100}%`);
			})
			.done(() => {
				this.tasks = this.tasks.filter(t => t !== task);
				console.log(task.id, 'Download is done!');
				notification.setStateCompleted();
				this.start();
			})
			.error((error) => {
				console.log(task.id, 'Download canceled due to error: ', error);
				notification.setStateCancelled();
			});
	}

	private async start(): Promise<void> {
		if (this.tasks.length > 0) {
			console.log('start tasks', this.tasks.length);
			const task = this.tasks[0];
			const notification = await DownloadNotification.create(
				`Audio ${task.id}`,
				this.intentHandler
			);
			this.connectToTask(task, notification);
			task.resume();
		}
	}
}
