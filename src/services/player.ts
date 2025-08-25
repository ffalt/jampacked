import { useEffect, useState } from 'react';
import { AudioFormatType } from './jam';
import dataService from './data';
import { TrackEntry } from './types';
import { State, TrackPlayer, TrackPlayerTrack, useTrackPlayerCurrentTrack } from './player-api';

async function buildTrackPlayerTrack(t: TrackEntry): Promise<TrackPlayerTrack> {
	const headers = dataService.currentUserToken ? { Authorization: `Bearer ${dataService.currentUserToken}` } : undefined;
	const imageID = t.seriesID ? t.id : (t.albumID ?? t.id);
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

export const JamPlayer = {
	shuffleQueueSync(): void {
		JamPlayer.shuffleQueue().catch(console.error);
	},

	async shuffleQueue(): Promise<void> {
		await TrackPlayer.shuffle();
	},

	clearQueueSync(): void {
		JamPlayer.clearQueue().catch(console.error);
	},

	async clearQueue(): Promise<void> {
		await TrackPlayer.clear();
	},

	async addTrackToQueue(track: TrackEntry): Promise<void> {
		await TrackPlayer.add(await buildTrackPlayerTrack(track));
	},

	async removeTrackFromQueue(index: number): Promise<void> {
		await TrackPlayer.remove(index);
	},

	async addTracksToQueue(tracks: Array<TrackEntry>): Promise<void> {
		await TrackPlayer.add(await Promise.all(tracks.map(async t => buildTrackPlayerTrack(t))));
	},

	async playTrack(track: TrackEntry): Promise<void> {
		const queue = await TrackPlayer.getQueue();
		const queueItem = queue.findIndex(t => t.id === track.id);
		await (queueItem === -1 ? JamPlayer.playTracks([track]) : TrackPlayer.skip(queueItem));
	},

	async playTracks(tracks: Array<TrackEntry>): Promise<void> {
		const entries = await Promise.all(tracks.map(async t => buildTrackPlayerTrack(t)));
		await TrackPlayer.stop();
		await TrackPlayer.reset();
		await TrackPlayer.add(entries);
		return TrackPlayer.play();
	},

	async skipToTrack(index: number): Promise<void> {
		try {
			await TrackPlayer.skip(index);
		} catch (error) {
			console.error(error);
		}
	},

	skipBackwardSync(): void {
		JamPlayer.skipBackward().catch(console.error);
	},

	async skipBackward(): Promise<void> {
		try {
			await TrackPlayer.seekTo((await TrackPlayer.getPosition()) - 10);
		} catch (error) {
			console.error(error);
		}
	},

	async play(): Promise<void> {
		try {
			await TrackPlayer.play();
		} catch (error) {
			console.error(error);
		}
	},

	toggleSync(): void {
		JamPlayer.toggle().catch(console.error);
	},

	async toggle(): Promise<void> {
		try {
			const isPlaying = await TrackPlayer.getState() === State.Playing;
			await (isPlaying ? TrackPlayer.pause() : TrackPlayer.play());
		} catch (error) {
			console.error(error);
		}
	},

	async stop(): Promise<void> {
		try {
			await TrackPlayer.stop();
			await TrackPlayer.reset();
		} catch (error) {
			console.error(error);
		}
	},

	async destroy(): Promise<void> {
		try {
			await TrackPlayer.destroy();
		} catch (error) {
			console.error(error);
		}
	},

	async pause(): Promise<void> {
		try {
			await TrackPlayer.pause();
		} catch (error) {
			console.error(error);
		}
	},

	skipForwardSync(): void {
		JamPlayer.skipForward().catch(console.error);
	},

	async skipForward(): Promise<void> {
		try {
			await TrackPlayer.seekTo((await TrackPlayer.getPosition()) + 10);
		} catch (error) {
			console.error(error);
		}
	},

	skipToNextSync(): void {
		JamPlayer.skipToNext().catch(console.error);
	},

	async skipToNext(): Promise<void> {
		try {
			await TrackPlayer.skipToNext();
		} catch (error) {
			console.error(error);
		}
	},

	skipToPreviousSync(): void {
		JamPlayer.skipToPrevious().catch(console.error);
	},

	async skipToPrevious(): Promise<void> {
		try {
			await TrackPlayer.skipToPrevious();
		} catch (error) {
			console.error(error);
		}
	},

	async seekPercent(percent: number): Promise<void> {
		const duration = (await TrackPlayer.getDuration());
		await TrackPlayer.seekTo(duration * percent);
	},

	seekPercentSync(percent: number): void {
		JamPlayer.seekPercent(percent).catch(console.error);
	},

	async setVolume(number: number): Promise<void> {
		await TrackPlayer.setVolume(number);
	}
};

export function useCurrentTrackID(): string | undefined {
	const [trackId, setTrackId] = useState<string | undefined>(undefined);
	const track = useTrackPlayerCurrentTrack();

	useEffect(() => {
		setTrackId(track?.id);
	}, [track]);

	return trackId;
}
