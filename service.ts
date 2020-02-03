import {JamPlayer} from './src/services/player';
import {TrackPlayer} from './src/services/player-api';

let hasApp: boolean = false;

export function setAppAvailable(available: boolean): void {
	hasApp = available;
}

// | "playback-state"
// | "playback-queue-ended"
// | "playback-track-changed"
// | "remote-play-id"
// | "remote-play-search"
// | "remote-skip"
// | "remote-seek"
// | "remote-set-rating"
// | "remote-like"
// | "remote-dislike"
// | "remote-bookmark";

export default async function service(): Promise<void> {
	TrackPlayer.addEventListener('remote-play', () => JamPlayer.play());
	TrackPlayer.addEventListener('remote-pause', () => JamPlayer.pause());
	TrackPlayer.addEventListener('remote-next', () => JamPlayer.skipToNext());
	TrackPlayer.addEventListener('remote-previous', () => JamPlayer.skipToPrevious());
	TrackPlayer.addEventListener('remote-jump-forward', () => JamPlayer.skipForward());
	TrackPlayer.addEventListener('remote-jump-backward', () => JamPlayer.skipBackward());
	TrackPlayer.addEventListener('remote-stop', () => {
		if (hasApp) {
			JamPlayer.stop();
		} else {
			JamPlayer.destroy();
		}
	});
	TrackPlayer.addEventListener('remote-duck', (data) => {
		// if (data.paused || data.permanent)
		TrackPlayer.setVolume(data.ducking ? 0.5 : 1);
	});
	TrackPlayer.addEventListener('playback-error', data => {
		console.error('playback-error', data);
	});
	TrackPlayer.addEventListener('remote-seek', (data) => {
		TrackPlayer.seekTo(data.position);
	});

}