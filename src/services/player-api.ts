import TrackPlayer from 'react-native-track-player';
import {useEffect, useState} from 'react';

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

export const useTrackPlayerProgressPercent = (interval = 1000): { progress: number, bufferProgress: number } => {
	const [percent, setPercent] = useState<{ progress: number, bufferProgress: number }>({progress: 0, bufferProgress: 0});
	const {position, bufferedPosition, duration} = useTrackPlayerProgress(interval);

	useEffect(() => {
		const progress = duration ? (position / duration) : 0;
		const bufferProgress = duration ? (bufferedPosition / duration) : 0;
		setPercent({progress, bufferProgress});
	}, [position, bufferedPosition, duration]);

	return percent;
};

export const useTrackPlayerProgressMS = (): { duration: number, position: number } => {
	const [now, setNow] = useState<{ duration: number, position: number }>({duration: 0, position: 0});
	const {duration, position} = useTrackPlayerProgress();

	useEffect(() => {
		let isSubscribed = true;

		async function fetchData(): Promise<void> {
			const d = await TrackPlayer.getDuration();
			const p = await TrackPlayer.getPosition();
			if (isSubscribed) {
				setNow({duration: d * 1000, position: p * 1000});
			}
		}

		fetchData();
		return (): void => {
			isSubscribed = false;
		};
	}, []);

	useEffect(() => {
		setNow({duration: duration * 1000, position: position * 1000});
	}, [duration, position]);

	return now;
};

export {TrackPlayer, Track, TrackPlayerEvents, useTrackPlayerEvents, useTrackPlayerProgress};
