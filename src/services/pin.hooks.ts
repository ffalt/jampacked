import { useEffect, useRef, useState } from 'react';
import { Download, useTrackPlayerDownloadCached } from 'react-native-track-player';
import { TrackEntry } from '../types/track.ts';
import { PinCacheStat, PinMedia, PinState } from '../types/pin.ts';
import pinService from './pin.service.ts';

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
			pinService.getPinState(id)
				.then(value => {
					if (isUnmountedReference.current) {
						return;
					}
					setStat(value);
				})
				.catch(console.error);
		};

		if (id) {
			pinService.subscribePinChangeUpdates(id, refresh);
			refresh();
		}
		return (): void => {
			if (id) {
				pinService.unsubscribePinChangeUpdates(id, refresh);
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
			pinService.stat()
				.then(s => {
					if (isUnmountedReference.current) {
						return;
					}
					setStat(s);
				})
				.catch(console.error);
		};

		pinService.subscribeCacheChangeUpdates(refresh);
		refresh();
		return (): void => {
			pinService.unsubscribeCacheChangeUpdates(refresh);
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
			pinService.getPins()
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
		pinService.subscribePinsChangeSubscriptions(update);
		return (): void => {
			pinService.unsubscribePinsChangeSubscriptions(update);
		};
	}, []);

	return { media, loading };
}

export function usePinnedMediaDownload(id: string): { track?: TrackEntry; download?: Download } {
	const download = useTrackPlayerDownloadCached(id, pinService.manager);
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
			pinService.getPinnedTrack(id)
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
			pinService.getPinCount()
				.then(value => {
					if (isUnmountedReference.current) {
						return;
					}
					setCount(value);
				})
				.catch(console.error);
		};
		pinService.subscribePinsChangeSubscriptions(refresh);
		refresh();
		return (): void => {
			pinService.unsubscribePinsChangeSubscriptions(refresh);
		};
	}, []);

	return count;
}
