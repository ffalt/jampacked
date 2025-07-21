import { useEffect, useRef, useState } from 'react';
import dataService from './data';
import { PinMedia, PinCacheStat, PinState, TrackEntry } from './types';
import { Download, useTrackPlayerDownloadCached } from './player-api';

export function usePinState(id?: string): PinState | undefined {
	const [stat, setStat] = useState<PinState | undefined>();
	const isUnmountedRef = useRef(true);

	useEffect(() => {
		isUnmountedRef.current = false;
		return () => {
			isUnmountedRef.current = true;
		};
	}, []);

	useEffect(() => {
		const refresh = (): void => {
			if (!id) {
				return;
			}
			dataService.pin.getPinState(id)
				.then((value) => {
					if (isUnmountedRef.current) {
						return;
					}
					setStat(value);
				});
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
	const isUnmountedRef = useRef(true);

	useEffect(() => {
		isUnmountedRef.current = false;
		return () => {
			isUnmountedRef.current = true;
		};
	}, []);

	useEffect(() => {
		const refresh = (): void => {
			dataService.pin.stat()
				.then((s) => {
					if (isUnmountedRef.current) {
						return;
					}
					setStat(s);
				});
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
	const isUnmountedRef = useRef(true);

	useEffect(() => {
		isUnmountedRef.current = false;
		return () => {
			isUnmountedRef.current = true;
		};
	}, []);

	useEffect(() => {
		const update = (): void => {
			if (isUnmountedRef.current) {
				return;
			}
			dataService.pin.getPins().then((pins) => {
				if (isUnmountedRef.current) {
					return;
				}
				setMedia(pins);
				setLoading(false);
			});
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
	const isUnmountedRef = useRef(true);

	useEffect(() => {
		isUnmountedRef.current = false;
		return () => {
			isUnmountedRef.current = true;
		};
	}, []);

	useEffect(() => {
		const update = (): void => {
			if (isUnmountedRef.current) {
				return;
			}
			dataService.pin.getPinnedTrack(id).then((t) => {
				if (isUnmountedRef.current) {
					return;
				}
				setTrack(t);
			});
		};

		update();
	}, [download, id]);

	return { download, track };
}

export function usePinnedCount(): number {
	const [count, setCount] = useState<number>(0);
	const isUnmountedRef = useRef(true);

	useEffect(() => {
		isUnmountedRef.current = false;
		return () => {
			isUnmountedRef.current = true;
		};
	}, []);

	useEffect(() => {
		const refresh = (): void => {
			dataService.pin.getPinCount()
				.then((value) => {
					if (isUnmountedRef.current) {
						return;
					}
					setCount(value);
				});
		};

		dataService.pin.subscribePinsChangeSubscriptions(refresh);
		refresh();
		return (): void => {
			dataService.pin.unsubscribePinsChangeSubscriptions(refresh);
		};
	}, []);

	return count;
}
