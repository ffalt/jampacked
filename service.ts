import {JamPlayer} from './src/services/player';
import {Event, State, TrackPlayer} from './src/services/player-api';
import {snackError} from './src/services/snack';
import {ScrobbleWatch} from './src/services/scrobble';

let hasApp: boolean = false;

export function setAppAvailable(available: boolean): void {
	hasApp = available;
}

export default async function service(): Promise<void> {
	TrackPlayer.addEventListener(Event.PlaybackState, ({state}: { state: number }) => {
		if (state === State.Playing) {
			ScrobbleWatch.start();
		} else if (state === State.Paused) {
			ScrobbleWatch.pause();
		} else if (state === State.Stopped) {
			ScrobbleWatch.stop();
		}
	});
	TrackPlayer.addEventListener(Event.RemotePlay, () => JamPlayer.play());
	TrackPlayer.addEventListener(Event.RemotePause, () => JamPlayer.pause());
	TrackPlayer.addEventListener(Event.RemoteNext, () => JamPlayer.skipToNext());
	TrackPlayer.addEventListener(Event.RemotePrevious, () => JamPlayer.skipToPrevious());
	TrackPlayer.addEventListener(Event.RemoteJumpForward, () => JamPlayer.skipForward());
	TrackPlayer.addEventListener(Event.RemoteJumpBackward, () => JamPlayer.skipBackward());
	TrackPlayer.addEventListener(Event.RemoteStop, () => {
		if (hasApp) {
			JamPlayer.stop();
		}
	});
	TrackPlayer.addEventListener(Event.RemoteDuck, (data) => {
		TrackPlayer.setVolume((data.paused || data.permanent) ? 0.5 : 1);
	});
	TrackPlayer.addEventListener(Event.PlaybackError, error => {
		if (hasApp) {
			snackError(new Error(`${error.code}: ${error.message}`));
		}
	});
	TrackPlayer.addEventListener(Event.RemoteSeek, (data) => TrackPlayer.seekTo(data.position));
}
