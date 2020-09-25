import TrackPlayer from 'react-native-track-player';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const {TrackPlayerEvents, Track, useTrackPlayerEvents, useTrackPlayerProgress} = TrackPlayer;

export async function initPlayer(): Promise<void> {
	await TrackPlayer.setupPlayer();
	await TrackPlayer.updateOptions({
		stopWithApp: false,
		capabilities: [
			TrackPlayer.CAPABILITY_PLAY,
			TrackPlayer.CAPABILITY_PAUSE,
			TrackPlayer.CAPABILITY_JUMP_BACKWARD,
			TrackPlayer.CAPABILITY_JUMP_FORWARD,
			TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
			// TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
			TrackPlayer.CAPABILITY_STOP
		],
		compactCapabilities: [
			// TrackPlayer.CAPABILITY_JUMP_BACKWARD,
			TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
			// TrackPlayer.CAPABILITY_JUMP_FORWARD,
			TrackPlayer.CAPABILITY_STOP,
			TrackPlayer.CAPABILITY_PLAY,
			TrackPlayer.CAPABILITY_PAUSE
		]
	});
}

export {TrackPlayer, Track, TrackPlayerEvents, useTrackPlayerEvents, useTrackPlayerProgress};
