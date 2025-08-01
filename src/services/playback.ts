import dataService from './data';
import { JamPlayer } from './player';
import { snackError } from './snack';
import { TrackPlayer, Event, State } from './player-api';

let hasApp = false;
let wasPausedByDuck = false;

export function setAppAvailable(available: boolean): void {
	hasApp = available;
}

export default async function playbackService(): Promise<void> {
	TrackPlayer.addEventListener(Event.Scrobble, ({ trackIndex }) => {
		TrackPlayer.getTrack(trackIndex).then(track => {
			if (track?.id) {
				dataService.scrobble(track.id).catch(console.error);
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
}
