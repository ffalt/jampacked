import { useEffect, useRef, useState } from 'react';
import dataService from './data';
import { PinMedia, PinCacheStat, PinState, TrackEntry } from './types';
import { Download, useTrackPlayerDownloadCached } from './player-api';

export function usePinState(id?: string): PinState | undefined {
	const [stat, setStat] = useState<PinState | undefined>();
	const isUnmountedReference = useRef(true);

	useEffect(() => {
		isUnmountedReference.current = false;
		return () => {
			isUnmountedReference.current = true;
		};
	}, []);

	useEffect(() => {
		const refresh = (): void => {
			if (!id) {
				return;
			}
			dataService.pin.getPinState(id)
				.then(value => {
					if (isUnmountedReference.current) {
						return;
					}
					setStat(value);
				})
				.catch(console.error);
		};

		if (id) {
			dataService.pin.subscribePinChangeUpdates(id, refresh);
			refresh();
		}
		return (): void => {
			if (id) {
				dataService.pin.unsubscribePinChangeUpdates(id, refresh);
			}
		};
	}, [id]);

	return stat;
}

export function usePinCacheStat(): PinCacheStat | undefined {
	const [stat, setStat] = useState<PinCacheStat | undefined>();
	const isUnmountedReference = useRef(true);

	useEffect(() => {
		isUnmountedReference.current = false;
		return () => {
			isUnmountedReference.current = true;
		};
	}, []);

	useEffect(() => {
		const refresh = (): void => {
			dataService.pin.stat()
				.then(s => {
					if (isUnmountedReference.current) {
						return;
					}
					setStat(s);
				})
				.catch(console.error);
		};

		dataService.pin.subscribeCacheChangeUpdates(refresh);
		refresh();
		return (): void => {
			dataService.pin.unsubscribeCacheChangeUpdates(refresh);
		};
	}, []);

	return stat;
}

export function usePinnedMedia(): { media: Array<PinMedia>; loading: boolean } {
	const [media, setMedia] = useState<Array<PinMedia>>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const isUnmountedReference = useRef(true);

	useEffect(() => {
		isUnmountedReference.current = false;
		return () => {
			isUnmountedReference.current = true;
		};
	}, []);

	useEffect(() => {
		const update = (): void => {
			if (isUnmountedReference.current) {
				return;
			}
			dataService.pin.getPins()
				.then(pins => {
					if (isUnmountedReference.current) {
						return;
					}
					setMedia(pins);
					setLoading(false);
				})
				.catch(console.error);
		};

		update();
		dataService.pin.subscribePinsChangeSubscriptions(update);
		return (): void => {
			dataService.pin.unsubscribePinsChangeSubscriptions(update);
		};
	}, []);

	return { media, loading };
}

export function usePinnedMediaDownload(id: string): { track?: TrackEntry; download?: Download } {
	const download = useTrackPlayerDownloadCached(id, dataService.pin.manager);
	const [track, setTrack] = useState<TrackEntry | undefined>(undefined);
	const isUnmountedReference = useRef(true);

	useEffect(() => {
		isUnmountedReference.current = false;
		return () => {
			isUnmountedReference.current = true;
		};
	}, []);

	useEffect(() => {
		const update = (): void => {
			if (isUnmountedReference.current) {
				return;
			}
			dataService.pin.getPinnedTrack(id)
				.then(t => {
					if (isUnmountedReference.current) {
						return;
					}
					setTrack(t);
				})
				.catch(console.error);
		};
		update();
	}, [download, id]);

	return { download, track };
}

export function usePinnedCount(): number {
	const [count, setCount] = useState<number>(0);
	const isUnmountedReference = useRef(true);

	useEffect(() => {
		isUnmountedReference.current = false;
		return () => {
			isUnmountedReference.current = true;
		};
	}, []);

	useEffect(() => {
		const refresh = (): void => {
			dataService.pin.getPinCount()
				.then(value => {
					if (isUnmountedReference.current) {
						return;
					}
					setCount(value);
				})
				.catch(console.error);
		};
		dataService.pin.subscribePinsChangeSubscriptions(refresh);
		refresh();
		return (): void => {
			dataService.pin.unsubscribePinsChangeSubscriptions(refresh);
		};
	}, []);

	return count;
}
