import TrackPlayer, {
	Capability,
	DownloadState,
	Track,
	Download as TrackPlayerDownload,
	DownloadRequest as TrackPlayerDownloadRequest
} from 'react-native-track-player';
import { Platform } from 'react-native';

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
			// eslint-disable-next-line @typescript-eslint/no-require-imports
			icon: require('../assets/images/logo.png'),

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
export type Download = TrackPlayerDownload;
export type DownloadRequest = TrackPlayerDownloadRequest;

export {
	DownloadState,
	Event,
	State,
	TrackPlayerDownloadManager,
	default as TrackPlayer,
	useTrackPlayerCurrentDownloadsCached,
	useTrackPlayerCurrentTrack,
	useTrackPlayerCurrentTrackNr,
	useTrackPlayerDownloadCached,
	useTrackPlayerDownloadsCached,
	useTrackPlayerDownloadsPaused,
	useTrackPlayerHasSiblings,
	useTrackPlayerPlaybackStateIsPlaying,
	useTrackPlayerProgressMS,
	useTrackPlayerProgressPercent,
	useTrackPlayerQueue
} from 'react-native-track-player';
