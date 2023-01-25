import dataService from './data';
import {JamPlayer} from './player';
import {snackError} from './snack';
import {TrackPlayer, Event, State} from './player-api';

let hasApp: boolean = false;
let wasPausedByDuck: boolean = false;

export function setAppAvailable(available: boolean): void {
	hasApp = available;
}

export default async function playbackService(): Promise<void> {
	TrackPlayer.addEventListener(Event.Scrobble, ({trackIndex}) => {
		TrackPlayer.getTrack(trackIndex)
			.then(track => {
				if (track && track.id) {
					dataService.scrobble(track.id)
						.catch(e => {
							console.error(e);
						});
				}
			});
	});
	TrackPlayer.addEventListener(Event.RemotePlay, () => JamPlayer.play());
	TrackPlayer.addEventListener(Event.RemotePause, () => JamPlayer.pause());
	TrackPlayer.addEventListener(Event.RemoteNext, () => JamPlayer.skipToNext());
	TrackPlayer.addEventListener(Event.RemotePrevious, () => JamPlayer.skipToPrevious());
	TrackPlayer.addEventListener(Event.RemoteJumpForward, () => JamPlayer.skipForward());
	TrackPlayer.addEventListener(Event.RemoteJumpBackward, () => JamPlayer.skipBackward());
	TrackPlayer.addEventListener(Event.RemoteSeek, (data) => TrackPlayer.seekTo(data.position));
	TrackPlayer.addEventListener(Event.RemoteDuck, (data) => {
		if (data.permanent === true) {
			TrackPlayer.stop();
		} else {
			if (data.paused) {
				TrackPlayer.getState().then((playerState) => {
					wasPausedByDuck = playerState !== State.Paused;
					TrackPlayer.pause();
				});
			} else {
				if (wasPausedByDuck) {
					TrackPlayer.play();
					wasPausedByDuck = false;
				}
			}
		}

	});
	TrackPlayer.addEventListener(Event.RemoteStop, () => {
		if (hasApp) {
			JamPlayer.stop();
		} else {
			JamPlayer.destroy();
		}
	});
	TrackPlayer.addEventListener(Event.PlaybackError, error => {
		if (hasApp) {
			snackError(error);
		}
	});
}
