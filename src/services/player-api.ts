import TrackPlayer, {Capability, Event, Track, State} from 'react-native-track-player';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// const {TrackPlayerEvents, Track, useTrackPlayerEvents, useTrackPlayerProgress} = TrackPlayer;

export async function initPlayer(): Promise<void> {
	await TrackPlayer.setupPlayer();
	await TrackPlayer.updateOptions({
		stopWithApp: false,
		capabilities: [
			Capability.Play,
			Capability.Pause,
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

export type TrackPlayerTrack = Track;

export {TrackPlayer, Event, State};
