export class TrackPlayerDownloadManager {
	init(): void {

	}

	async setHeaders(_headers: { Authorization: string }): Promise<void> {
	}

	getCurrentDownloads(): Array<Download> {
		return [];
	}

	getDownloads(): Array<Download> {
		return [];
	}

	async remove(_ids: Array<string>): Promise<void> {
	}

	subscribeDownloadsChanges(_listen: () => void): void {
	}

	unsubscribeDownloadsChanges(_listen: () => void): void {
	}

	async clear(): Promise<void> {

	}

	async download(_requests: Array<DownloadRequest>): Promise<void> {
	}
}

export function downloadStateToString(mode: DownloadState): string {
	switch (mode) {
		case DownloadState.Completed:
			return 'Completed';
		case DownloadState.Downloading:
			return 'Downloading';
		case DownloadState.Failed:
			return 'Failed';
		case DownloadState.Queued:
			return 'Queued';
		case DownloadState.Removing:
			return 'Removing';
		case DownloadState.Restarting:
			return 'Restarting';
		case DownloadState.Stopped:
			return 'Stopped';
		default:
			return 'Unknown';
	}
}

export interface DownloadRequest {
	url: string;
	id: string;
}

export interface Download {
	id: string;
	url: string;
	state: number;
	contentLength: number;
	bytesDownloaded: number;
	percentDownloaded: number;
	failureReason: number;
	stopReason: number;
	startTimeMs: number;
	updateTimeMs: number;
}

export async function resumeDownloads(): Promise<void> {
}

export async function pauseDownloads(): Promise<void> {
}

export function useTrackPlayerDownloadsPaused(): boolean {
	return true;
}

export function useTrackPlayerDownloadsCached(_cache: TrackPlayerDownloadManager): Array<Download> | undefined {
	return [];
}

export function useTrackPlayerDownloadCached(_id: string, _cache: TrackPlayerDownloadManager): Download | undefined {
	return undefined;
}

export function useCurrentDownloadsCached(_cache: TrackPlayerDownloadManager): Array<Download> | undefined {
	return [];
}

export enum DownloadState {
	Queued = 0,
	Stopped = 1,
	Downloading = 2,
	Completed = 3,
	Failed = 4,
	Removing = 5,
	Restarting = 6
}
