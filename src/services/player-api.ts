import TrackPlayer, {AddTrack,
	AppKilledPlaybackBehavior,
	Capability,
	Event,
	PlaybackState,
	Progress,
	State,
	Track,
	useActiveTrack as useTrackPlayerCurrentTrack,
	useIsPlaying as useTrackPlayerPlaybackStateIsPlaying,
	useProgress as useTrackPlayerProgressMS} from 'react-native-track-player';
import {Platform} from 'react-native';
import {useEffect, useRef, useState} from 'react';

export async function initPlayer(): Promise<void> {
	const isRunning = (Platform.OS === 'android') && (await TrackPlayer.isServiceRunning());
	if (!isRunning) {
		await TrackPlayer.setupPlayer({
			maxCacheSize: 1024 * 4,
			autoUpdateMetadata: true
		});
		await TrackPlayer.updateOptions({
			android: {
				alwaysPauseOnInterruption: true,
				appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback
			},
			icon: require('../assets/images/logo.png'),

			capabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SeekTo,
				Capability.JumpBackward,
				Capability.JumpForward,
				Capability.SkipToNext,
				Capability.Stop
			],
			notificationCapabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SeekTo,
				Capability.JumpBackward,
				Capability.JumpForward,
				Capability.SkipToNext,
				Capability.Stop
			],
			compactCapabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
				Capability.Stop
			]
		});
	}
}

export function useTrackPlayerProgressPercent(interval = 1000): number {
	const [pc, setPC] = useState<number>(0);
	const progress = useTrackPlayerProgressMS(interval);
	useEffect(() => {
		setPC(progress.position / progress.duration);
	}, [progress]);
	return pc;
}

export function useTrackPlayerHasSiblings(): { hasNext: boolean, hasPrevious: boolean } {
	return {hasNext: false, hasPrevious: false};
}

export function useTrackPlayerQueue(): Array<Track> | undefined {
	const [queue, setQueueState] = useState<Array<Track> | undefined>();
	const isUnmountedRef = useRef(true);

	useEffect(() => {
		isUnmountedRef.current = false;
		return () => {
			isUnmountedRef.current = true;
		};
	}, []);

	const refresh = (): () => void => {
		const update = (): void => {
			TrackPlayer.getQueue()
				.then(value => {
					if (isUnmountedRef.current) {
						return;
					}
					setQueueState(value);
				})
				.catch(console.error);
		};
		queueChangeEmitter.addListener(update);
		update();
		return () => queueChangeEmitter.removeListener(update);
	};

	useEffect(() => refresh(), []);

	return queue;
}

export function useTrackPlayerCurrentTrackNr(): number | undefined {
	const [trackNr, setTrackNr] = useState<number | undefined>(undefined);
	const track = useTrackPlayerCurrentTrack();
	const isUnmountedRef = useRef(true);

	useEffect(() => {
		isUnmountedRef.current = false;
		return () => {
			isUnmountedRef.current = true;
		};
	}, []);

	useEffect(() => {
		TrackPlayer.getActiveTrackIndex()
			.then(value => {
				if (isUnmountedRef.current) {
					return;
				}
				setTrackNr(value);
			})
			.catch(console.error);
	}, [track]);
	return trackNr;
}

class Emitter {
	listeners: ((...params: any[]) => void)[] = [];

	addListener(listener: (...params: any[]) => void): void {
		this.listeners.push(listener);
	}

	removeListener(listener: (...params: any[]) => void): void {
		this.listeners = this.listeners.filter(value => value === listener);
	}

	emit<T = any>(...params: T[]): void {
		this.listeners.forEach(listener => listener(...params));
	}
}

const queueChangeEmitter = new Emitter();

async function add(tracks: AddTrack[], insertBeforeIndex?: number): Promise<number | void> {
	const result = await TrackPlayer.add(tracks, insertBeforeIndex);
	queueChangeEmitter.emit();
	return result;
}

async function remove(indexes: number[]): Promise<void> {
	await TrackPlayer.remove(indexes);
	queueChangeEmitter.emit();
}

async function isPlaying(): Promise<boolean> {
	return (await TrackPlayer.getPlaybackState()).state === State.Playing;
}

async function shuffle(): Promise<void> {
	let startIndex = (await TrackPlayer.getActiveTrackIndex()) || 0;
	const queue = await TrackPlayer.getQueue();
	const length = queue.length;
	if (startIndex < 0) {
		startIndex = 0;
	} else if (await isPlaying()) {
		startIndex++;
	}
	// Fisher-Yates shuffle
	for (let i = startIndex; i < length; i++) {
		const max = i + 1 - startIndex;
		const randomInt = Math.floor(Math.random() * max);
		const swapIndex = randomInt + startIndex;
		const item = queue[i];
		queue[i] = queue[swapIndex];
		queue[swapIndex] = item;
	}
	await TrackPlayer.setQueue(queue);
	queueChangeEmitter.emit();
}

async function clearQueue(): Promise<void> {
	await TrackPlayer.setQueue([]);
	queueChangeEmitter.emit();
}

async function reset(): Promise<void> {
	await TrackPlayer.reset();
	queueChangeEmitter.emit();
}

class TrackPlayerExt {
	static addEventListener = TrackPlayer.addEventListener;
	static seekTo = TrackPlayer.seekTo;
	static stop = TrackPlayer.stop;
	static pause = TrackPlayer.pause;
	static play = TrackPlayer.play;
	static skip = TrackPlayer.skip;
	static skipToNext = TrackPlayer.skipToNext;
	static skipToPrevious = TrackPlayer.skipToPrevious;
	static getProgress = TrackPlayer.getProgress;
	static setVolume = TrackPlayer.setVolume;
	static seekBy = TrackPlayer.seekBy;
	static getQueue = TrackPlayer.getQueue;
	static getActiveTrack = TrackPlayer.getActiveTrack;
	static clearQueue = clearQueue;
	static getPlaybackState = TrackPlayer.getPlaybackState;
	static registerPlaybackService = TrackPlayer.registerPlaybackService;
	static removeUpcomingTracks = TrackPlayer.removeUpcomingTracks;
	static reset = reset;
	static shuffle = shuffle;
	static add = add;
	static remove = remove;
}

export type TrackPlayerPlaybackState = PlaybackState;
export type TrackPlayerProgress = Progress;
export type TrackPlayerTrack = Track;

export {
	TrackPlayerExt as TrackPlayer,
	useTrackPlayerCurrentTrack,
	useTrackPlayerPlaybackStateIsPlaying,
	useTrackPlayerProgressMS,
	Event,
	State
};
