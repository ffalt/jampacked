/**
 * Shared manual mock for the native player. Auto-applied to every test (root
 * `__mocks__` for a node_modules package needs no `jest.mock()` call).
 *
 * Tests that care about a hook's value drive it directly, e.g.
 *   (useTrackPlayerCurrentTrackID as jest.Mock).mockReturnValue('track-1');
 * rather than re-declaring a partial module factory, which used to silently
 * drop the default export and `TrackPlayerDownloadManager`.
 */

// The package `exports` map blocks requiring the constant modules directly, so
// the enums are inlined. Values match the library's own no-native-module
// fallbacks, which is exactly what a test would observe.
export const State = { None: 1, Ready: 2, Playing: 3, Paused: 4, Stopped: 5, Buffering: 6, Connecting: 7 } as const;

export const Capability = {
	Play: 1, PlayFromId: 2, PlayFromSearch: 3, Pause: 4, Stop: 5, SeekTo: 6, Skip: 7,
	SkipToNext: 8, SkipToPrevious: 9, JumpForward: 10, JumpBackward: 11, SetRating: 12,
	Like: 13, Dislike: 14, Bookmark: 15
} as const;

export const DownloadState = {
	Queued: 1, Stopped: 2, Downloading: 3, Completed: 4, Failed: 5, Removing: 6, Restarting: 7
} as const;

export const RepeatMode = { Off: 1, Track: 2, Queue: 3 } as const;

export const RatingType = { Heart: 1, ThumbsUpDown: 2, ThreeStars: 3, FourStars: 4, FiveStars: 5, Percentage: 6 } as const;

export const PitchAlgorithm = { Linear: 1, Music: 2, Voice: 3 } as const;

export const TrackType = { Default: 'default', Dash: 'dash', HLS: 'hls', SmoothStreaming: 'smoothstreaming' } as const;

export const Event = {
	PlaybackState: 'playback-state',
	PlaybackError: 'playback-error',
	PlaybackQueueEnded: 'playback-queue-ended',
	PlaybackTrackChanged: 'playback-track-changed',
	PlaybackParametersChanged: 'playback-parameters-changed',
	QueueChanged: 'queue-changed',
	DownloadsChanged: 'downloads-changed',
	DownloadsPausedChanged: 'downloads-paused-changed',
	DownloadChanged: 'download-changed',
	DownloadProgressChanged: 'download-progress-changed',
	ShuffleModeChanged: 'shuffle-changed',
	RepeatModeChanged: 'repeat-changed',
	Scrobble: 'scrobble',
	PlaybackMetadataReceived: 'playback-metadata-received',
	RemotePlay: 'remote-play',
	RemotePlayId: 'remote-play-id',
	RemotePlaySearch: 'remote-play-search',
	RemotePause: 'remote-pause',
	RemoteStop: 'remote-stop',
	RemoteSkip: 'remote-skip',
	RemoteNext: 'remote-next',
	RemotePrevious: 'remote-previous',
	RemoteJumpForward: 'remote-jump-forward',
	RemoteJumpBackward: 'remote-jump-backward',
	RemoteSeek: 'remote-seek',
	RemoteSetRating: 'remote-set-rating',
	RemoteDuck: 'remote-duck',
	RemoteLike: 'remote-like',
	RemoteDislike: 'remote-dislike',
	RemoteBookmark: 'remote-bookmark'
} as const;

export const TrackPlayerDownloadManager = jest.fn(() => ({
	init: jest.fn(async (): Promise<void> => undefined),
	setHeaders: jest.fn(async (): Promise<void> => undefined),
	getDownloads: jest.fn(() => []),
	getCurrentDownloads: jest.fn(() => []),
	download: jest.fn(async (): Promise<void> => undefined),
	remove: jest.fn(async (): Promise<void> => undefined),
	subscribeDownloadsChanges: jest.fn(),
	unsubscribeDownloadsChanges: jest.fn()
}));

const TrackPlayer = {
	addEventListener: jest.fn(() => ({ remove: jest.fn() })),
	registerEventHandler: jest.fn(),
	registerPlaybackService: jest.fn(),
	setupPlayer: jest.fn(),
	updateOptions: jest.fn(),
	reset: jest.fn(),
	add: jest.fn(),
	remove: jest.fn(),
	skip: jest.fn(),
	skipToNext: jest.fn(),
	skipToPrevious: jest.fn(),
	removeUpcomingTracks: jest.fn(),
	// playback commands
	play: jest.fn(),
	pause: jest.fn(),
	stop: jest.fn(),
	seekTo: jest.fn(),
	setVolume: jest.fn(),
	setRate: jest.fn(),
	// the app chains .catch() on these, so they must resolve
	pauseDownloads: jest.fn(async (): Promise<void> => undefined),
	resumeDownloads: jest.fn(async (): Promise<void> => undefined),
	// player getters
	getQueue: jest.fn(),
	getTrack: jest.fn(),
	getCurrentTrack: jest.fn(),
	getVolume: jest.fn(),
	getDuration: jest.fn(),
	getPosition: jest.fn(),
	getBufferedPosition: jest.fn(),
	getState: jest.fn(),
	getRate: jest.fn()
};

export default TrackPlayer;

// hooks
export const useTrackPlayerProgress = jest.fn(() => ({ position: 100, duration: 200 }));
export const useTrackPlayerProgressMS = jest.fn(() => ({ position: 0, duration: 0 }));
export const useTrackPlayerProgressPercent = jest.fn(() => ({ progress: 0 }));
export const useTrackPlayerCurrentTrack = jest.fn(() => undefined);
export const useTrackPlayerCurrentTrackID = jest.fn(() => undefined);
export const useTrackPlayerCurrentTrackNr = jest.fn(() => undefined);
export const useTrackPlayerQueue = jest.fn(() => []);
export const useTrackPlayerHasSiblings = jest.fn(() => ({ hasPrevious: false, hasNext: false }));
export const useTrackPlayerPlaybackStateIsPlaying = jest.fn(() => false);
export const useTrackPlayerDownloadCached = jest.fn(() => undefined);
export const useTrackPlayerDownloadsCached = jest.fn(() => []);
export const useTrackPlayerCurrentDownloadsCached = jest.fn(() => []);
export const useTrackPlayerDownloadsPaused = jest.fn(() => false);
