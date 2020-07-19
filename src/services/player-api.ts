import TrackPlayer from 'react-native-track-player';
import {useEffect, useState} from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore-next-line
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

export const useTrackPlayerProgressPercent = (): { progress: number, bufferProgress: number } => {
	const [percent, setPercent] = useState<{ progress: number, bufferProgress: number }>({progress: 0, bufferProgress: 0});
	const {position, bufferedPosition, duration} = useTrackPlayerProgress();

	useEffect(() => {
		const progress = duration ? (position / duration) : 0;
		const bufferProgress = duration ? (bufferedPosition / duration) : 0;
		setPercent({progress, bufferProgress});
	}, [position, bufferedPosition, duration]);

	return percent;
};

export {TrackPlayer, Track, TrackPlayerEvents, useTrackPlayerEvents, useTrackPlayerProgress};
