import TrackPlayer, {Capability, Event, State, Track} from 'react-native-track-player';
import {Platform} from 'react-native';

export async function initPlayer(): Promise<void> {
	const isRunning = (Platform.OS === 'android') && ( await TrackPlayer.isServiceRunning());
	if (!isRunning) {
		await TrackPlayer.setupPlayer();
		await TrackPlayer.updateOptions({
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

export {TrackPlayer, Event, State};
