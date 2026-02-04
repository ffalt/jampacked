import TrackPlayer from 'react-native-track-player';
import storageService from './storage.service.ts';
import jamService from './jam.service.ts';
import { buildTrackPlayerTrack } from '../utils/build-track.ts';
import { TrackEntry } from '../types/track.ts';

const QUEUE_STORAGE_KEY = 'player-queue';

interface StoredQueue {
	tracks: Array<TrackEntry>;
	currentIndex: number;
	position: number;
}

class QueueStorageService {
	async save(): Promise<void> {
		try {
			const queue = await TrackPlayer.getQueue();
			if (queue.length === 0) {
				await storageService.setSetting(QUEUE_STORAGE_KEY, undefined);
				return;
			}
			const currentIndex = await TrackPlayer.getCurrentTrack() ?? 0;
			const position = await TrackPlayer.getPosition();
			const tracks: Array<TrackEntry> = queue.map(track => ({
				id: track.id ?? '',
				title: track.title ?? '',
				artist: track.artist ?? '',
				album: track.album ?? '',
				genre: track.genre,
				duration: '',
				durationMS: (track.duration ?? 0) * 1000,
				trackNr: ''
			}));
			const data: StoredQueue = { tracks, currentIndex, position };
			await storageService.setSetting(QUEUE_STORAGE_KEY, JSON.stringify(data));
		} catch (error) {
			console.error('Failed to save queue:', error);
		}
	}

	async load(): Promise<void> {
		try {
			const stored = await storageService.getSetting(QUEUE_STORAGE_KEY);
			if (!stored) {
				return;
			}
			const data = JSON.parse(stored) as StoredQueue;
			if (!data.tracks || data.tracks.length === 0) {
				return;
			}
			const entries = await Promise.all(
				data.tracks.map(async t => buildTrackPlayerTrack(jamService, t))
			);
			await TrackPlayer.reset();
			await TrackPlayer.add(entries);
			if (data.currentIndex > 0 && data.currentIndex < entries.length) {
				await TrackPlayer.skip(data.currentIndex);
			}
			if (data.position > 0) {
				await TrackPlayer.seekTo(data.position);
			}
		} catch (error) {
			console.error('Failed to load queue:', error);
		}
	}

	async clear(): Promise<void> {
		await storageService.setSetting(QUEUE_STORAGE_KEY, undefined);
	}
}

const queueStorageService = new QueueStorageService();
export default queueStorageService;
