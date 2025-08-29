import jamService from './jam.service.ts';
import { buildTrackPlayerTrack } from '../utils/build-track.ts';
import TrackPlayer, { State } from 'react-native-track-player';
import { TrackEntry } from '../types/track.ts';

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
		await TrackPlayer.add(await buildTrackPlayerTrack(jamService, track));
	},

	async removeTrackFromQueue(index: number): Promise<void> {
		await TrackPlayer.remove(index);
	},

	async addTracksToQueue(tracks: Array<TrackEntry>): Promise<void> {
		await TrackPlayer.add(await Promise.all(tracks.map(async t => buildTrackPlayerTrack(jamService, t))));
	},

	async playTrack(track: TrackEntry): Promise<void> {
		const queue = await TrackPlayer.getQueue();
		const queueItem = queue.findIndex(t => t.id === track.id);
		await (queueItem === -1 ? JamPlayer.playTracks([track]) : TrackPlayer.skip(queueItem));
	},

	async playTracks(tracks: Array<TrackEntry>): Promise<void> {
		const entries = await Promise.all(tracks.map(async t => buildTrackPlayerTrack(jamService, t)));
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
			TrackPlayer.destroy();
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
