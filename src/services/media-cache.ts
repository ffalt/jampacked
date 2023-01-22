import {humanFileSize} from '../utils/filesize.utils';
import {TrackPlayer, DownloadState, Event, TrackPlayerDownload, TrackPlayerDownloadRequest} from './player-api';
import {EmitterSubscription} from 'react-native';

export interface MediaCacheStat {
	files: number;
	size: number;
	humanSize: string;
}

export interface DownloadOption extends TrackPlayerDownloadRequest {
	id: string;
	url: string;
	headers?: { [key: string]: string };
}

export class MediaCache {
	downloads: Array<TrackPlayerDownload> = [];
	private downloadSubscriptions = new Map<string, Array<(download: TrackPlayerDownload) => void>>();
	private downloadsSubscriptions: Array<(downloads: Array<TrackPlayerDownload>) => void> = [];
	private cacheChangeSubscriptions: Array<() => void> = [];
	private trackPlayerListener: Array<EmitterSubscription> = [];

	async init(): Promise<void> {
		this.trackPlayerListener =
			[
				TrackPlayer.addEventListener(Event.DownloadsChanged, async () => {
					await this.updateList();
				}),
				TrackPlayer.addEventListener(Event.DownloadProgressChanged, async (event) => {
					await this.updateItemProgress(event.id, event.percentDownloaded, event.bytesDownloaded, event.contentLength);
				}),
				TrackPlayer.addEventListener(Event.DownloadChanged, async (event) => {
					await this.updateItem(event.id, event.state);
				})
			];
	}

	cleanup(): void {
		this.trackPlayerListener.forEach(listener => listener.remove());
	}

	private async updateList(): Promise<void> {
		this.downloads = await TrackPlayer.getCurrentDownloads();
	}

	private async updateItem(id: string, _: DownloadState): Promise<void> {
		const index = this.downloads.findIndex(d => d.id === id);
		const download = await TrackPlayer.getDownload(id);
		if (!download) {
			if (index > 0) {
				this.downloads.splice(index, 1);
			}
			return;
		}
		if (index < 0) {
			this.downloads.push(download);
		} else {
			this.downloads[index] = download;
		}
		this.notifyTaskChange(download);
	}

	private async updateItemProgress(id: string, percentDownloaded: number, bytesDownloaded: number, contentLength: number): Promise<void> {
		const index = this.downloads.findIndex(d => d.id === id);
		if (index > 0) {
			this.downloads[index].contentLength = contentLength;
			this.downloads[index].percentDownloaded = percentDownloaded;
			this.downloads[index].bytesDownloaded = bytesDownloaded;
			this.notifyTaskChange(this.downloads[index]);
		}
	}

	async stat(): Promise<MediaCacheStat> {
		let size = 0;
		let files = 0;
		const downloads = await TrackPlayer.getDownloads();
		for (const item of downloads) {
			if (item.state === DownloadState.Completed) {
				size += Number(item.contentLength);
				files += 1;
			}
		}
		return {files, size, humanSize: humanFileSize(size)};
	}

	async clear(): Promise<void> {
		await TrackPlayer.removeDownloads();
		this.notifyCacheChange();
	}

	async removeFromCache(ids: Array<string>): Promise<void> {
		for (const id of ids) {
			await TrackPlayer.removeDownload(id);
		}
		this.notifyCacheChange();
	}

	async download(downloads: Array<DownloadOption>): Promise<void> {
		await TrackPlayer.addDownloads(downloads);
		this.notifyTasksChange();
	}

	subscribeTaskUpdates(listen: (tasks: Array<TrackPlayerDownload>) => void): void {
		this.downloadsSubscriptions.push(listen);
	}

	unsubscribeTaskUpdates(listen: (tasks: Array<TrackPlayerDownload>) => void): void {
		this.downloadsSubscriptions = this.downloadsSubscriptions.filter(u => u !== listen);
	}

	subscribeCacheChangeUpdates(listen: () => void): void {
		this.cacheChangeSubscriptions.push(listen);
	}

	unsubscribeCacheChangeUpdates(listen: () => void): void {
		this.cacheChangeSubscriptions = this.cacheChangeSubscriptions.filter(u => u !== listen);
	}

	getDownload(id: string): TrackPlayerDownload | undefined {
		return this.downloads.find(t => t.id === id);
	}

	hasAnyCurrentDownloads(ids: Array<string>): boolean {
		// const downloads = TrackPlayer.getCurrentDownloads();
		return !!this.downloads.find(t => ids.includes(t.id));
	}

	async removeDownloads(ids: Array<string>): Promise<void> {
		for (const id of ids) {
			await TrackPlayer.removeDownload(id);
		}
	}

	private notifyTaskChange(task: TrackPlayerDownload): void {
		const array = this.downloadSubscriptions.get(task.id) || [];
		array.forEach(update => update(task));
	}

	private notifyCacheChange(): void {
		this.cacheChangeSubscriptions.forEach(update => update());
	}

	private notifyTasksChange(): void {
		const list = this.downloads.slice(0);
		this.downloadsSubscriptions.forEach(update => update(list));
	}

	subscribeDownloadUpdates(id: string, update: (download: TrackPlayerDownload) => void): void {
		const array = this.downloadSubscriptions.get(id) || [];
		array.push(update);
		this.downloadSubscriptions.set(id, array);
	}

	unsubscribeDownloadUpdates(id: string, update: (progress: TrackPlayerDownload) => void): void {
		let array = this.downloadSubscriptions.get(id) || [];
		array = array.splice(array.indexOf(update), 1);
		if (array.length === 0) {
			this.downloadSubscriptions.delete(id);
		} else {
			this.downloadSubscriptions.set(id, array);
		}
	}

}
