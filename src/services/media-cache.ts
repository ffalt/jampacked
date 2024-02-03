import RNBackgroundDownloader, {DownloadOption as DownloaderOption, DownloadTask as DownloaderTask} from '@kesha-antonov/react-native-background-downloader';
import RNFS from 'react-native-fs';
import {humanFileSize} from '../utils/filesize.utils';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import {EventSubscription} from 'react-native';

export interface MediaCacheStat {
	files: number;
	size: number;
	humanSize: string;
}

export interface DownloadProgress {
	error?: Error;
	task: DownloadTask;
}

export class MediaCache {
	tasks: Array<DownloadTask> = [];
	private downloadSubscriptions = new EventEmitter();
	private downloadsSubscriptions = new EventEmitter();

	async init(): Promise<void> {
		const lostTasks = await RNBackgroundDownloader.checkForExistingDownloads();
		this.tasks = lostTasks || [];
		for (const task of this.tasks) {
			this.connectToTask(task);
		}
		await this.initCachePath();
	}

	async initCachePath(): Promise<void> {
		try {
			await RNFS.mkdir(this.cachePath());
		} catch (e) {
			console.error(e);
		}
	}

	async isDownloaded(id: string): Promise<boolean> {
		return await RNFS.exists(this.pathInCache(id));
	}

	cachePath(): string {
		return `${RNBackgroundDownloader.directories.documents}/mp3`;
	}

	async stat(): Promise<MediaCacheStat> {
		let size = 0;
		let files = 0;
		const result = await RNFS.readDir(this.cachePath());
		for (const item of result) {
			if (item.isFile()) {
				size += Number(item.size);
				files += 1;
			}
		}
		return {files, size, humanSize: humanFileSize(size)};
	}

	async getCount(): Promise<number> {
		return (await this.stat()).files;
	}

	async clearTasks(): Promise<void> {
		this.tasks.forEach(task => task.stop());
		this.tasks = [];
	}

	async clear(): Promise<void> {
		await this.clearTasks();
		await RNFS.unlink(this.cachePath());
		await this.initCachePath();
		this.notifyCacheChange();
	}

	async removeFromCache(ids: Array<string>): Promise<void> {
		for (const id of ids) {
			if (await this.isDownloaded(id)) {
				await RNFS.unlink(this.pathInCache(id));
			}
		}
		this.notifyCacheChange();
	}

	async list(): Promise<Array<string>> {
		return RNFS.readdir(this.cachePath());
	}

	pathInCache(id: string): string {
		return `${this.cachePath()}/${id}.mp3`;
	}

	async download(downloads: Array<DownloadOption>): Promise<void> {
		for (const t of downloads) {
			if (!this.tasks.find(d => d.id === t.id) && !await this.isDownloaded(t.id)) {
				const task = RNBackgroundDownloader.download(t);
				// task.pause();
				this.connectToTask(task);
				this.tasks.push(task);
			}
		}
		this.notifyTasksChange();
	}

	private connectToTask(task: DownloadTask): void {
		task
			.begin(() => {
				// console.log(task.id, `Going to download ${task.totalBytes} bytes!`);
				this.notifyTaskChange(task);
			})
			.progress(() => {
				this.notifyTaskChange(task);
				// console.log(task.id, `Downloaded: ${task.percent * 100}%, ETA: ${task.etaInMilliSeconds}`);
			})
			.error(() => {
				this.notifyTaskChange(task);
				// console.log(task.id, `Resumed`);
			})
			.done(() => {
				this.tasks = this.tasks.filter(t => t !== task);
				this.notifyTasksChange();
				this.notifyCacheChange();
				// console.log(task.id, 'Download is done!');
			});
	}

	subscribeTaskUpdates(update: (tasks: Array<DownloadTask>) => void): EventSubscription {
		return this.downloadsSubscriptions.addListener('tasks', update);
	}

	subscribeCacheChangeUpdates(update: () => void): EventSubscription {
		return this.downloadsSubscriptions.addListener('cache', update);
	}

	subscribeDownloadUpdates(id: string, update: (progress: DownloadProgress) => void): EventSubscription {
		return this.downloadSubscriptions.addListener(id, update);
	}

	getProgress(id: string): DownloadProgress | undefined {
		const task = this.tasks.find(t => t.id === id);
		return task ? {task} : undefined;
	}

	hasDownloadTask(id: string): boolean {
		return !!this.tasks.find(t => t.id === id);
	}

	hasAnyDownloadTask(ids: Array<string>): boolean {
		return !!this.tasks.find(t => ids.includes(t.id));
	}

	async cancelTasks(ids: Array<string>): Promise<void> {
		const tasks = this.tasks.filter(t => ids.includes(t.id));
		tasks.forEach(task => {
			task.stop();
		});
	}

	private notifyTaskChange(task: DownloadTask): void {
		this.downloadSubscriptions.emit(task.id, {task});
	}

	private notifyCacheChange(): void {
		this.downloadsSubscriptions.emit('cache');
	}

	private notifyTasksChange(): void {
		const list = this.tasks.slice(0);
		this.downloadsSubscriptions.emit('tasks', list);
	}
}

export type DownloadOption = DownloaderOption;
export type DownloadTask = DownloaderTask;
