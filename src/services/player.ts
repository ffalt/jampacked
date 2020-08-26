import {useEffect, useState} from 'react';
import {AudioFormatType} from './jam';
import {TrackPlayer, TrackPlayerEvents, useTrackPlayerEvents} from './player-api';
import dataService from './data';
import {TrackEntry} from './types';


function buildTrackPlayerTrack(t: TrackEntry): TrackPlayer.Track {
	const headers = dataService.currentUserToken ? {Authorization: `Bearer ${dataService.currentUserToken}`} : undefined;
	const imageID = t.seriesID ? t.id : (t.albumID || t.id);
	const track: TrackPlayer.Track = {
		id: t.id,
		url: dataService.jam.stream.streamUrl({id: t.id, format: AudioFormatType.mp3}, !headers),
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
	return track;
}

export class JamPlayer {

	static async clearQueue(): Promise<void> {
		const fetched = await TrackPlayer.getQueue();
		const current = await TrackPlayer.getCurrentTrack();
		const ids = fetched.map(track => track.id).filter(id => id !== current);
		await TrackPlayer.remove(ids);
		if (ids.length === 0) {
			await JamPlayer.stop();
		}
	}

	static async addTrackToQueue(track: TrackEntry): Promise<void> {
		await TrackPlayer.add(buildTrackPlayerTrack(track));
	}

	static async removeTrackFromQueue(trackID: string): Promise<void> {
		await TrackPlayer.remove(trackID);
	}

	static async addTracksToQueue(tracks: Array<TrackEntry>): Promise<void> {
		await TrackPlayer.add(tracks.map(t => buildTrackPlayerTrack(t)));
	}

	static async playTrack(track: TrackEntry): Promise<void> {
		const queueItem = (await TrackPlayer.getQueue()).find(t => t.id === track.id);
		if (queueItem) {
			await TrackPlayer.skip(track.id);
		} else {
			await JamPlayer.playTracks([track]);
		}
	}

	static async playTracks(tracks: Array<TrackEntry>): Promise<void> {
		await TrackPlayer.reset();
		await TrackPlayer.add(tracks.map(t => buildTrackPlayerTrack(t)));
		await TrackPlayer.play();
	}

	static async skipToTrack(id: string): Promise<void> {
		try {
			await TrackPlayer.skip(id);
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
			if (await TrackPlayer.getState() === TrackPlayer.STATE_PAUSED) {
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
}

export function useQueue(): Array<TrackPlayer.Track> {
	const [queue, setQueueState] = useState<Array<TrackPlayer.Track>>([]);

	useEffect(() => {
		let didCancel = false;
		const fetchQueue = async (): Promise<void> => {
			const fetched = await TrackPlayer.getQueue();
			if (!didCancel) {
				if (fetched?.length !== queue?.length) {
					setQueueState(fetched);
				} else if (queue) {
					for (let i = 0; i < fetched.length; i++) {
						if (queue[i].id !== fetched[i].id) {
							setQueueState(fetched);
							return;
						}
					}
				}
			}
		};
		fetchQueue().catch(e => console.error(e));
		return (): void => {
			didCancel = true;
		};
	}, [queue]);

	return queue;
}

export function useCurrentTrack(): TrackPlayer.Track | undefined {
	const [trackId, setTrackId] = useState<string | undefined>(undefined);
	const [track, setTrack] = useState<TrackPlayer.Track | undefined>(undefined);

	async function getTrack(tId: string | undefined): Promise<TrackPlayer.Track | undefined> {
		const q = await TrackPlayer.getQueue();
		return q.find(({id}) => id === tId) || undefined;
	}

	useTrackPlayerEvents(
		[TrackPlayerEvents.PLAYBACK_TRACK_CHANGED],
		({nextTrack}: { nextTrack: string | undefined }) => {
			setTrackId(nextTrack);
		}
	);

	useEffect(() => {
		let didCancel = false;
		TrackPlayer.getCurrentTrack().then(tId => {
			if (!didCancel) {
				setTrackId(tId);
				getTrack(tId).then(t => setTrack(t));
			}
		});
		return (): void => {
			didCancel = true;
		};
	}, [trackId]);

	return track;
}

export function useCurrentTrackID(): string | undefined {
	const [trackId, setTrackId] = useState<string | undefined>(undefined);

	useTrackPlayerEvents(
		[TrackPlayerEvents.PLAYBACK_TRACK_CHANGED],
		({nextTrack}: { nextTrack: string | undefined }) => {
			if (trackId !== nextTrack) {
				setTrackId(nextTrack);
			}
		}
	);

	useEffect((): any => {
		let isSubscribed = true;
		TrackPlayer.getCurrentTrack().then(tId => {
			if (isSubscribed && trackId !== tId) {
				setTrackId(tId);
			}
		});
		return (): any => isSubscribed = false;
	}, [trackId]);

	return trackId;
}

const getQueueIndex = (track: TrackPlayer.Track, queue: Array<TrackPlayer.Track>): number => queue.findIndex(({id}) => id === track.id);

export function useNextTrack(): TrackPlayer.Track | undefined {
	const queue = useQueue();
	const currentTrack = useCurrentTrack();
	const [nextTrack, setNextTrack] = useState<TrackPlayer.Track | undefined>(undefined);
	useEffect(() => {
		if (!currentTrack) {
			return;
		}
		const index = getQueueIndex(currentTrack, queue);
		const hasNextTrack = index < (queue.length - 1);
		setNextTrack(hasNextTrack ? queue[index + 1] : undefined);
	}, [queue, currentTrack]);
	return nextTrack;
}

export function usePreviousTrack(): TrackPlayer.Track | undefined {
	const queue = useQueue();
	const currentTrack = useCurrentTrack();
	const [previousTrack, setPreviousTrack] = useState<TrackPlayer.Track | undefined>(undefined);
	useEffect(() => {
		if (!currentTrack) {
			return;
		}
		const index = getQueueIndex(currentTrack, queue);
		const hasPreviousTrack = index !== 0;
		setPreviousTrack(hasPreviousTrack ? queue[index - 1] : undefined);
	}, [queue, currentTrack]);
	return previousTrack;
}

function useWhenPlaybackStateChanges(callback: (state: TrackPlayer.State) => void): void {
	useTrackPlayerEvents(
		[TrackPlayerEvents.PLAYBACK_STATE],
		({state}: { state: TrackPlayer.State }) => {
			callback(state);
		}
	);
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

export function usePlaybackState(): TrackPlayer.State | undefined {
	const [playbackState, setPlaybackState] = useState<TrackPlayer.State | undefined>();
	useWhenPlaybackStateChanges(setPlaybackState);
	return playbackState;
}

export const usePlaybackStateIs = (...states: Array<TrackPlayer.State>): boolean => {
	const [is, setIs] = useState<boolean>(false);
	useWhenPlaybackStateChanges(state => {
		setIs(states.includes(state));
	});
	return is;
};

export const usePlaybackStateIsPlaying = (): boolean => {
	const [is, setIs] = useState<boolean>(false);
	useWhenPlaybackStateChanges(state => {
		setIs(state === TrackPlayer.STATE_PLAYING);
	});
	return is;
};
