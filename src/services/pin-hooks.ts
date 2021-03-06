import {useEffect, useState} from 'react';
import dataService from './data';
import {JamObjectType} from './jam';
import {PinMedia, PinState} from './types';
import {DownloadProgress, MediaCacheStat} from './media-cache';
import {DownloadTask} from 'react-native-background-downloader';

export function usePinState(id?: string, objType?: JamObjectType): PinState | undefined {
	const [stat, setStat] = useState<PinState | undefined>();

	useEffect(() => {
		let isSubscribed = true;

		const update = (state: PinState): void => {
			if (isSubscribed) {
				setStat(state);
			}
		};

		if (id && objType) {
			dataService.pin.subscribePinChangeUpdates(id, update);
			dataService.pin.getPinState(id).then(update);
		}
		return (): void => {
			isSubscribed = false;
			if (id) {
				dataService.pin.unsubscribePinChangeUpdates(id, update);
			}
		};
	}, [id, objType]);

	return stat;
}

export function useMediaCacheStat(): MediaCacheStat | undefined {
	const [stat, setStat] = useState<MediaCacheStat | undefined>();
	//
	// useEffect(() => {
	//
	// 	let isSubscribed = true;
	//
	// 	dataService.mediaCacheStat()
	// 		.then(result => {
	// 			if (isSubscribed) {
	// 				setStat(result);
	// 			}
	// 		});
	//
	// 	return (): void => {
	// 		isSubscribed = false;
	// 	};
	//
	// }, []);

	useEffect(() => {
		let isSubscribed = true;

		const update = (): void => {
			dataService.pin.pinCache.stat()
				.then(s => {
					if (isSubscribed) {
						setStat(s);
					}
				});
		};

		dataService.pin.pinCache.subscribeCacheChangeUpdates(update);
		update();
		return (): void => {
			isSubscribed = false;
			dataService.pin.pinCache.unsubscribeCacheChangeUpdates(update);
		};
	}, []);

	return stat;
}

export function usePinnedMedia(): { media: Array<PinMedia>, loading: boolean } {
	const [media, setMedia] = useState<Array<PinMedia>>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let isSubscribed = true;

		const update = (): void => {
			dataService.pin.getPins().then(pins => {
				if (isSubscribed) {
					setMedia(pins);
					setLoading(false);
				}
			});
		};

		update();
		// dataService.mediaCache.subscribePinsChanges(update);
		return (): void => {
			isSubscribed = false;
			// dataService.mediaCache.unsubscribePinsChanges(update);
		};
	}, []);

	return {media, loading};
}

export function useDownloads(): Array<DownloadTask> {
	const [tasks, setTasks] = useState<Array<DownloadTask>>(dataService.pin.pinCache.tasks);

	useEffect(() => {
		let isSubscribed = true;
		const update = (list: Array<DownloadTask>): void => {
			if (isSubscribed) {
				setTasks(list);
			}
		};

		dataService.pin.pinCache.subscribeTaskUpdates(update);
		return (): void => {
			isSubscribed = false;
			dataService.pin.pinCache.unsubscribeTaskUpdates(update);
		};
	}, [tasks]);


	return tasks;
}

export const useDownloadStatus = (id: string): DownloadProgress | undefined => {

	const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | undefined>(
		dataService.pin.pinCache.getProgress(id)
	);

	useEffect(() => {
		let isSubscribed = true;
		const update = (progress: DownloadProgress): void => {
			if (isSubscribed) {
				setDownloadProgress(progress);
			}
		};
		dataService.pin.pinCache.subscribeDownloadUpdates(id, update);
		return (): void => {
			isSubscribed = false;
			dataService.pin.pinCache.unsubscribeDownloadUpdates(id, update);
		};
	}, [id]);

	return downloadProgress;
};
