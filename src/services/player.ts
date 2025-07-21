import { useEffect, useState } from 'react';
import { AudioFormatType } from './jam';
import dataService from './data';
import { TrackEntry } from './types';
import { TrackPlayer, TrackPlayerTrack, State, useTrackPlayerCurrentTrack } from './player-api';

async function buildTrackPlayerTrack(t: TrackEntry): Promise<TrackPlayerTrack> {
	const headers = dataService.currentUserToken ? { Authorization: `Bearer ${dataService.currentUserToken}` } : undefined;
	const imageID = t.seriesID ? t.id : (t.albumID || t.id);
	const url = dataService.jam.stream.streamUrl({ id: t.id, format: AudioFormatType.mp3 }, !headers);
	return {
		id: t.id,
		url,
		title: t.title,
		artist: t.artist,
		album: t.album,
		genre: t.genre,
		duration: t.durationMS / 1000,
		artwork: dataService.jam.image.imageUrl({ id: imageID, size: 300 }, !headers),
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

export function useCurrentTrackID(): string | undefined {
	const [trackId, setTrackId] = useState<string | undefined>(undefined);
	const track = useTrackPlayerCurrentTrack();

	useEffect(() => {
		setTrackId(track?.id);
	}, [track]);

	return trackId;
}
