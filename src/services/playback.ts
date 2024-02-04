import dataService from './data';
import {JamPlayer} from './player';
import {snackError} from './snack';
import {TrackPlayer, TrackPlayerTrack, Event, State} from './player-api';
import {Scrobble} from './scrobble.ts';

let hasApp: boolean = false;
let wasPausedByDuck: boolean = false;

export function setAppAvailable(available: boolean): void {
	hasApp = available;
}

function scrobble(track: TrackPlayerTrack): void {
	if (track && track.id) {
		dataService.scrobble(track.id)
			.catch(e => {
				console.error(e);
			});
	}
}

export default async function playbackService(): Promise<void> {
	Scrobble.addScrobbleListener(scrobble);
	TrackPlayer.addEventListener(Event.RemotePlay, () => JamPlayer.play());
	TrackPlayer.addEventListener(Event.RemotePause, () => JamPlayer.pause());
	TrackPlayer.addEventListener(Event.RemoteNext, () => JamPlayer.skipToNext());
	TrackPlayer.addEventListener(Event.RemotePrevious, () => JamPlayer.skipToPrevious());
	TrackPlayer.addEventListener(Event.RemoteJumpForward, () => JamPlayer.skipForward());
	TrackPlayer.addEventListener(Event.RemoteJumpBackward, () => JamPlayer.skipBackward());
	TrackPlayer.addEventListener(Event.RemoteSeek, (data) => TrackPlayer.seekTo(data.position));
	TrackPlayer.addEventListener(Event.RemoteDuck, (data) => {
		if (data.permanent) {
			TrackPlayer.stop();
		} else {
			if (data.paused) {
				TrackPlayer.getPlaybackState().then((playerState) => {
					wasPausedByDuck = playerState.state !== State.Paused;
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
