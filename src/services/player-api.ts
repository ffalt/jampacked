import TrackPlayer, {Capability, Event, State, Track} from 'react-native-track-player';
import {Platform} from 'react-native';

export async function initPlayer(): Promise<void> {
	const isRunning = (Platform.OS === 'android') && (await TrackPlayer.isServiceRunning());
	if (!isRunning) {
		await TrackPlayer.setupPlayer();
		await TrackPlayer.updateOptions({
			stopWithApp: false,
			alwaysPauseOnInterruption: false,
			capabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SeekTo,
				Capability.JumpBackward,
				Capability.JumpForward,
				Capability.SkipToNext,
				Capability.Stop
			],
			notificationCapabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SeekTo,
				Capability.JumpBackward,
				Capability.JumpForward,
				Capability.SkipToNext,
				Capability.Stop
			],
			compactCapabilities: [
				Capability.Play,
				Capability.Pause,
				Capability.SkipToNext,
				Capability.Stop
			]
		});
	}
}

export type TrackPlayerTrack = Track;

export const stateToString = (state: State): string => {
	switch (state) {
		case State.Buffering:
			return 'Buffering';
		case State.Connecting:
			return 'Connecting';
		case State.None:
			return 'None';
		case State.Paused:
			return 'Paused';
		case State.Playing:
			return 'Playing';
		case State.Ready:
			return 'Ready';
		case State.Stopped:
			return 'Stopped';
		default:
			return 'Undefined';

	}
};

export {TrackPlayer, Event, State};
