import { JamPlayer } from './player.service.ts';
import { snackError } from '../utils/snack.ts';
import TrackPlayer, { Event, State } from 'react-native-track-player';
import jamService from './jam.service.ts';
import cacheService from './cache.service.ts';
import queueStorageService from './queue-storage.service.ts';

let hasApp = false;
let wasPausedByDuck = false;

export function setAppAvailable(available: boolean): void {
	hasApp = available;
}

export default async function playbackService(): Promise<void> {
	TrackPlayer.addEventListener(Event.Scrobble, ({ trackIndex }) => {
		TrackPlayer.getTrack(trackIndex).then(track => {
			if (track?.id) {
				jamService.nowplaying.scrobble({ id: track?.id }).then(() => {
					cacheService.updateHomeData().catch(console.error);
				}).catch(console.error);
			}
		}).catch(console.error);
	});
	TrackPlayer.addEventListener(Event.RemotePlay, () => {
		JamPlayer.play().catch(console.error);
	});
	TrackPlayer.addEventListener(Event.RemotePause, () => {
		JamPlayer.pause().catch(console.error);
	});
	TrackPlayer.addEventListener(Event.RemoteNext, () => {
		JamPlayer.skipToNext().catch(console.error);
	});
	TrackPlayer.addEventListener(Event.RemotePrevious, () => {
		JamPlayer.skipToPrevious().catch(console.error);
	});
	TrackPlayer.addEventListener(Event.RemoteJumpForward, () => {
		JamPlayer.skipForward().catch(console.error);
	});
	TrackPlayer.addEventListener(Event.RemoteJumpBackward, () => {
		JamPlayer.skipBackward().catch(console.error);
	});
	TrackPlayer.addEventListener(Event.RemoteSeek, data => {
		TrackPlayer.seekTo(data.position).catch(console.error);
	});
	TrackPlayer.addEventListener(Event.RemoteDuck, data => {
		if (data.permanent === true) {
			TrackPlayer.stop().catch(console.error);
		} else if (data.paused) {
			TrackPlayer.getState().then(async playerState => {
				wasPausedByDuck = playerState !== State.Paused;
				await TrackPlayer.pause();
			}).catch(console.error);
		} else if (wasPausedByDuck) {
			TrackPlayer.play().catch(console.error);
			wasPausedByDuck = false;
		}
	});
	TrackPlayer.addEventListener(Event.RemoteStop, () => {
		if (hasApp) {
			JamPlayer.stop().catch(console.error);
		} else {
			JamPlayer.destroy().catch(console.error);
		}
	});
	TrackPlayer.addEventListener(Event.PlaybackError, error => {
		if (hasApp) {
			snackError(error);
		}
	});
	TrackPlayer.addEventListener(Event.PlaybackTrackChanged, () => {
		queueStorageService.save().catch(console.error);
	});
	TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
		queueStorageService.save().catch(console.error);
	});
}
