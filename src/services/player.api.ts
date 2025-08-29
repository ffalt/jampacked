import TrackPlayer, { Capability, DownloadState, Track } from 'react-native-track-player';
import { Platform } from 'react-native';
import { IMAGE_LOGO } from '../style/images.ts';

export async function initPlayer(): Promise<void> {
	const isRunning = (Platform.OS === 'android') && (await TrackPlayer.isServiceRunning());
	if (!isRunning) {
		await TrackPlayer.setupPlayer({
			maxCacheSize: 1024 * 4,
			autoUpdateMetadata: true
		});
		await TrackPlayer.updateOptions({
			stopWithApp: false,
			alwaysPauseOnInterruption: true,
			scrobble: true,
			icon: IMAGE_LOGO,

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

export function downloadStateToString(mode: DownloadState): string {
	switch (mode) {
		case DownloadState.Completed: {
			return 'Completed';
		}
		case DownloadState.Downloading: {
			return 'Downloading';
		}
		case DownloadState.Failed: {
			return 'Failed';
		}
		case DownloadState.Queued: {
			return 'Queued';
		}
		case DownloadState.Removing: {
			return 'Removing';
		}
		case DownloadState.Restarting: {
			return 'Restarting';
		}
		case DownloadState.Stopped: {
			return 'Stopped';
		}
		default: {
			return 'Unknown';
		}
	}
}

export type TrackPlayerTrack = Track;
