import {useEffect, useState} from 'react';
import {AudioFormatType} from './jam';
import dataService from './data';
import {TrackEntry} from './types';
import TrackPlayer, {Event, State, useProgress, useTrackPlayerEvents} from 'react-native-track-player';
import {TrackPlayerTrack} from './player-api';

async function buildTrackPlayerTrack(t: TrackEntry): Promise<TrackPlayerTrack> {
	const headers = dataService.currentUserToken ? {Authorization: `Bearer ${dataService.currentUserToken}`} : undefined;
	const imageID = t.seriesID ? t.id : (t.albumID || t.id);
	const local = await dataService.pin.isDownloaded(t.id);
	const url = local ?
		dataService.pin.pinCache.pathInCache(t.id) :
		dataService.jam.stream.streamUrl({id: t.id, format: AudioFormatType.mp3}, !headers);
	return {
		id: t.id,
		url,
		title: t.title,
		artist: t.artist,
		album: t.album,
		genre: t.genre,
		duration: t.durationMS / 1000,
		artwork: dataService.jam.image.imageUrl({id: imageID, size: 300}, !headers),
		headers
		// type: TrackType.default;
		// date: t.tag?.year,
		// description?: string;
		// rating?: number | boolean;
		// userAgent?: string;
		// contentType?: string;
		// pitchAlgorithm?: PitchAlgorithm
	};
}

export class JamPlayer {

	static async shuffleQueue(): Promise<void> {
		await TrackPlayer.shuffle();
	}

	static async clearQueue(): Promise<void> {
		await TrackPlayer.clear();
	}

	static async addTrackToQueue(track: TrackEntry): Promise<void> {
		await TrackPlayer.add(await buildTrackPlayerTrack(track));
	}

	static async removeTrackFromQueue(index: number): Promise<void> {
		await TrackPlayer.remove(index);
	}

	static async addTracksToQueue(tracks: Array<TrackEntry>): Promise<void> {
		await TrackPlayer.add(await Promise.all(tracks.map(t => buildTrackPlayerTrack(t))));
	}

	static async playTrack(track: TrackEntry): Promise<void> {
		const queueItem = (await TrackPlayer.getQueue()).findIndex(t => t.id === track.id);
		if (queueItem >= 0) {
			await TrackPlayer.skip(queueItem);
		} else {
			await JamPlayer.playTracks([track]);
		}
	}


	static async playTracks(tracks: Array<TrackEntry>): Promise<void> {
		const entries = await Promise.all(tracks.map(t => buildTrackPlayerTrack(t)));
		await TrackPlayer.stop();
		await TrackPlayer.reset();
		await TrackPlayer.add(entries);
		return TrackPlayer.play();
	}

	static async skipToTrack(index: number): Promise<void> {
		try {
			await TrackPlayer.skip(index);
		} catch (e) {
			console.error(e);
		}
	}

	static async skipBackward(): Promise<void> {
		try {
			await TrackPlayer.seekTo((await TrackPlayer.getPosition()) - 10);
		} catch (e) {
			console.error(e);
		}
	}

	static async play(): Promise<void> {
		try {
			await TrackPlayer.play();
		} catch (e) {
			console.error(e);
		}
	}

	static async toggle(): Promise<void> {
		try {
			if (await TrackPlayer.getState() !== State.Playing) {
				await TrackPlayer.play();
			} else {
				await TrackPlayer.pause();
			}
		} catch (e) {
			console.error(e);
		}
	}

	static async stop(): Promise<void> {
		try {
			await TrackPlayer.stop();
			await TrackPlayer.reset();
		} catch (e) {
			console.error(e);
		}
	}

	static async destroy(): Promise<void> {
		try {
			await TrackPlayer.destroy();
		} catch (e) {
			console.error(e);
		}
	}

	static async pause(): Promise<void> {
		try {
			await TrackPlayer.pause();
		} catch (e) {
			console.error(e);
		}
	}

	static async skipForward(): Promise<void> {
		try {
			await TrackPlayer.seekTo((await TrackPlayer.getPosition()) + 10);
		} catch (e) {
			console.error(e);
		}
	}

	static async skipToNext(): Promise<void> {
		try {
			await TrackPlayer.skipToNext();
		} catch (e) {
			console.error(e);
		}
	}

	static async skipToPrevious(): Promise<void> {
		try {
			await TrackPlayer.skipToPrevious();
		} catch (e) {
			console.error(e);
		}
	}

	static async seekPercent(percent: number): Promise<void> {
		const duration = (await TrackPlayer.getDuration());
		await TrackPlayer.seekTo(duration * percent);
	}

	static async setVolume(number: number): Promise<void> {
		await TrackPlayer.setVolume(number);
	}
}

export function useQueue(): Array<TrackPlayerTrack> | undefined {
	const [queue, setQueueState] = useState<Array<TrackPlayerTrack> | undefined>();

	useEffect(() => {
		let didCancel = false;
		const fetchQueue = async (): Promise<void> => {
			const fetched = await TrackPlayer.getQueue();
			if (!didCancel) {
				setQueueState(fetched);
			}
		};
		fetchQueue().catch(e => console.error(e));
		return (): void => {
			didCancel = true;
		};
	}, [queue]);

	useTrackPlayerEvents(
		[Event.QueueChanged], async () => {
			setQueueState(await TrackPlayer.getQueue());
		}
	);

	return queue;
}


export function useCurrentTrackID(): string | undefined {
	const [trackNr, setTrackNr] = useState<number | undefined>(undefined);
	const [trackId, setTrackId] = useState<string | undefined>(undefined);

	async function getTrack(tnr: number | undefined): Promise<TrackPlayerTrack | undefined> {
		const q = await TrackPlayer.getQueue();
		return tnr !== undefined ? q[tnr] : undefined;
	}

	useTrackPlayerEvents(
		[Event.PlaybackTrackChanged], event => {
			if (trackNr !== event.nextTrack) {
				setTrackNr(event.nextTrack);
			}
		}
	);

	useEffect(() => {
		let isSubscribed = true;
		TrackPlayer.getCurrentTrack().then(tNr => {
			if (isSubscribed && trackNr !== tNr) {
				setTrackNr(tNr);
			}
			getTrack(tNr).then(t => {
				if (isSubscribed && t && trackId !== t.id) {
					setTrackId(t.id);
				}
			});
		});
		return (): void => {
			isSubscribed = false;
		};
	}, [trackNr, trackId]);

	return trackId;
}

export function useCurrentTrack(): TrackPlayerTrack | undefined {
	const [trackNr, setTrackNr] = useState<number | undefined>(undefined);
	const [track, setTrack] = useState<TrackPlayerTrack | undefined>(undefined);

	async function getTrack(tnr: number | undefined): Promise<TrackPlayerTrack | undefined> {
		const q = await TrackPlayer.getQueue();
		return tnr !== undefined ? q[tnr] : undefined;
	}

	useTrackPlayerEvents(
		[Event.PlaybackTrackChanged], event => {
			if (trackNr !== event.nextTrack) {
				setTrackNr(event.nextTrack);
			}
		}
	);

	useEffect(() => {
		let didCancel = false;
		TrackPlayer.getCurrentTrack().then(tnr => {
			if (!didCancel) {
				setTrackNr(tnr);
				getTrack(tnr).then(t => {
					if (!didCancel) {
						setTrack(t);
					}
				});
			}
		});
		return (): void => {
			didCancel = true;
		};
	}, [trackNr]);

	return track;
}

export function useCurrentTrackIndex(): number | undefined {
	const [trackIndex, setTrackIndex] = useState<number | undefined>(undefined);

	useTrackPlayerEvents(
		[Event.PlaybackTrackChanged], event => {
			if (trackIndex !== event.nextTrack) {
				setTrackIndex(event.nextTrack);
			}
		}
	);

	useEffect(() => {
		let isSubscribed = true;
		TrackPlayer.getCurrentTrack().then(i => {
			if (isSubscribed && trackIndex !== i) {
				setTrackIndex(i);
			}
		});
		return (): void => {
			isSubscribed = false;
		};
	}, [trackIndex]);

	return trackIndex;
}

const getQueueIndex = (track: TrackPlayerTrack, queue: Array<TrackPlayerTrack>): number => queue.findIndex(({id}) => id === track.id);

export function useNextTrack(): TrackPlayerTrack | undefined {
	const queue = useQueue();
	const currentTrack = useCurrentTrack();
	const [nextTrack, setNextTrack] = useState<TrackPlayerTrack | undefined>(undefined);
	useEffect(() => {
		if (!currentTrack || !queue) {
			return;
		}
		const index = getQueueIndex(currentTrack, queue);
		const hasNextTrack = index < (queue.length - 1);
		setNextTrack(hasNextTrack ? queue[index + 1] : undefined);
	}, [queue, currentTrack]);
	return nextTrack;
}

export function usePreviousTrack(): TrackPlayerTrack | undefined {
	const queue = useQueue();
	const currentTrack = useCurrentTrack();
	const [previousTrack, setPreviousTrack] = useState<TrackPlayerTrack | undefined>(undefined);
	useEffect(() => {
		if (!currentTrack || !queue) {
			return;
		}
		const index = getQueueIndex(currentTrack, queue);
		const hasPreviousTrack = index !== 0;
		setPreviousTrack(hasPreviousTrack ? queue[index - 1] : undefined);
	}, [queue, currentTrack]);
	return previousTrack;
}

function useWhenPlaybackStateChanges(callback: (state: State) => void): void {

	useTrackPlayerEvents([Event.PlaybackState], event => callback(event.state));

	useEffect(() => {
		let didCancel = false;

		async function fetchPlaybackState(): Promise<void> {
			const playbackState = await TrackPlayer.getState();
			if (!didCancel) {
				callback(playbackState);
			}
		}

		fetchPlaybackState();
		return (): void => {
			didCancel = true;
		};
	}, [callback]);
}

export function usePlaybackState(): State | undefined {
	const [playbackState, setPlaybackState] = useState<State | undefined>();
	useWhenPlaybackStateChanges(setPlaybackState);
	return playbackState;
}

export const usePlaybackStateIs = (...states: Array<State>): boolean => {
	const [is, setIs] = useState<boolean>(false);
	useWhenPlaybackStateChanges(state => {
		setIs(states.includes(state));
	});
	return is;
};

export const usePlaybackStateIsPlaying = (): boolean => {
	const [is, setIs] = useState<boolean>(false);
	useWhenPlaybackStateChanges(state => {
		setIs(state === State.Playing);
	});
	return is;
};

export const useTrackPlayerProgressPercent = (interval = 1000): { progress: number, bufferProgress: number } => {
	const [percent, setPercent] = useState<{ progress: number, bufferProgress: number }>({progress: 0, bufferProgress: 0});
	const {position, buffered, duration} = useProgress(interval);

	useWhenPlaybackStateChanges(state => {
		if (state === State.Stopped) {
			setPercent({progress: 0, bufferProgress: 0});
		}
	});

	useEffect(() => {
		const progress = duration ? (position / duration) : 0;
		const bufferProgress = duration ? (buffered / duration) : 0;
		setPercent({progress, bufferProgress});
	}, [position, buffered, duration]);

	return percent;
};

export const useTrackPlayerProgressMS = (): { duration: number, position: number } => {
	const [now, setNow] = useState<{ duration: number, position: number }>({duration: 0, position: 0});
	const {duration, position} = useProgress();

	useWhenPlaybackStateChanges(state => {
		if (state === State.Stopped) {
			setNow({duration: 0, position: 0});
		}
	});

	useEffect(() => {
		let isSubscribed = true;

		async function fetchData(): Promise<void> {
			const d = await TrackPlayer.getDuration();
			const p = await TrackPlayer.getPosition();
			if (isSubscribed) {
				setNow({duration: d * 1000, position: p * 1000});
			}
		}

		fetchData();
		return (): void => {
			isSubscribed = false;
		};
	}, []);

	useEffect(() => {
		setNow({duration: duration * 1000, position: position * 1000});
	}, [duration, position]);

	return now;
};
