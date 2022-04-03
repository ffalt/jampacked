import BackgroundTimer from 'react-native-background-timer';
import {TrackPlayer} from './player-api';
import dataService from './data';

const MONITOR_INTERVAL = 2000;

const scrobble: {
	active: boolean;
	done: boolean;
	time: number;
	trigger: number;
	id?: string;
} = {
	id: undefined,
	active: false,
	done: false,
	time: 0,
	trigger: 0
};

async function monitorProgress(): Promise<void> {
	const index = await TrackPlayer.getCurrentTrack();
	const q = await TrackPlayer.getQueue();
	const id = q[index]?.id;
	if (!id) {
		scrobble.done = false;
		return;
	}
	if (id !== scrobble.id) {
		scrobble.time = MONITOR_INTERVAL;
		scrobble.id = id;
		scrobble.done = false;
	} else {
		scrobble.time += MONITOR_INTERVAL;
	}
	if (scrobble.trigger === 0) {
		const duration = (await TrackPlayer.getDuration()) * 1000;
		scrobble.trigger = Math.min(duration / 2, 4 * 60 * 60 * 1000);
	}
	if (!scrobble.done && scrobble.trigger > 0 && scrobble.time > scrobble.trigger) {
		scrobble.done = true;
		dataService.scrobble(id)
			.catch(e => {
				console.error(e);
			});
	}
}

export class ScrobbleWatch {
	static start(): void {
		if (scrobble.active) {
			return;
		}
		scrobble.active = true;
		BackgroundTimer.runBackgroundTimer(() => monitorProgress(), MONITOR_INTERVAL);
	}

	static pause(): void {
		BackgroundTimer.stopBackgroundTimer();
		scrobble.active = false;
	}

	static stop(): void {
		BackgroundTimer.stopBackgroundTimer();
		scrobble.active = false;
		scrobble.time = 0;
		scrobble.trigger = 0;
		scrobble.done = false;
		scrobble.id = undefined;
	}

}
