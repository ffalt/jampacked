import {DownloadProgress, MediaCacheStat} from './media-cache';
import {useEffect, useState} from 'react';
import {DownloadTask} from 'react-native-background-downloader';
import dataService, {PinMedia} from './data';


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
			dataService.mediaCache.stat()
				.then(s => {
					if (isSubscribed) {
						setStat(s);
					}
				});
		};

		dataService.mediaCache.subscribeCacheChangeUpdates(update);
		update();
		return (): void => {
			isSubscribed = false;
			dataService.mediaCache.unsubscribeCacheChangeUpdates(update);
		};
	}, []);

	return stat;
}


export function usePinnedMedia(): { media: Array<PinMedia>, loading: boolean } {
	const [media, setMedia] = useState<Array<PinMedia>>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let isSubscribed = true;

		const update = () => {
			dataService.getPins().then(pins => {
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
	const [tasks, setTasks] = useState<Array<DownloadTask>>(dataService.mediaCache.tasks);

	useEffect(() => {
		let isSubscribed = true;
		const update = (list: Array<DownloadTask>): void => {
			if (isSubscribed) {
				setTasks(list);
			}
		};

		dataService.mediaCache.subscribeTaskUpdates(update);
		return (): void => {
			isSubscribed = false;
			dataService.mediaCache.unsubscribeTaskUpdates(update);
		};
	}, [tasks]);


	return tasks;
}

export const useDownloadStatus = (id: string): DownloadProgress | undefined => {

	const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | undefined>(
		dataService.mediaCache.getProgress(id)
	);

	useEffect(() => {
		let isSubscribed = true;
		const update = (progress: DownloadProgress): void => {
			if (isSubscribed) {
				setDownloadProgress(progress);
			}
		};
		dataService.mediaCache.subscribeDownloadUpdates(id, update);
		return (): void => {
			isSubscribed = false;
			dataService.mediaCache.unsubscribeDownloadUpdates(id, update);
		};
	}, [id]);

	return downloadProgress;
};
