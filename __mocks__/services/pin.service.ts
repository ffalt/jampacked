export const mockPinManager = {
	init: jest.fn(async (): Promise<void> => undefined),
	setHeaders: jest.fn(async (): Promise<void> => undefined),
	getDownloads: jest.fn(() => []),
	getCurrentDownloads: jest.fn(() => []),
	download: jest.fn(async (): Promise<void> => undefined),
	remove: jest.fn(async (): Promise<void> => undefined),
	subscribeDownloadsChanges: jest.fn(),
	unsubscribeDownloadsChanges: jest.fn(),
	pauseDownloads: jest.fn(),
	resumeDownloads: jest.fn()
};

const pinService = {
	manager: mockPinManager,
	init: jest.fn(async (): Promise<void> => undefined),
	updateHeaders: jest.fn(async (): Promise<void> => undefined),
	hasAnyCurrentDownloads: jest.fn(async (): Promise<boolean> => false),
	stat: jest.fn(async () => ({ count: 0, size: 0 })),
	getPinState: jest.fn(async () => ({ pinned: false })),
	pinObject: jest.fn(async (): Promise<void> => undefined),
	pinAlbum: jest.fn(async (): Promise<void> => undefined),
	pinFolder: jest.fn(async (): Promise<void> => undefined),
	pinPlaylist: jest.fn(async (): Promise<void> => undefined),
	pinTrack: jest.fn(async (): Promise<void> => undefined),
	pinPodcastEpisode: jest.fn(async (): Promise<void> => undefined),
	pin: jest.fn(async (): Promise<void> => undefined),
	unpin: jest.fn(async (): Promise<void> => undefined),
	getPinCount: jest.fn(async (): Promise<number> => 0),
	getPinnedTrack: jest.fn(async () => undefined),
	filterPinnedByOthers: jest.fn(async () => []),
	notifyPinChange: jest.fn(),
	subscribeCacheChangeUpdates: jest.fn(),
	unsubscribeCacheChangeUpdates: jest.fn(),
	subscribePinChangeUpdates: jest.fn(),
	unsubscribePinChangeUpdates: jest.fn(),
	subscribePinsChangeSubscriptions: jest.fn(),
	unsubscribePinsChangeSubscriptions: jest.fn(),
	notifyPinsChange: jest.fn(),
	clearPins: jest.fn(async (): Promise<void> => undefined),
	getPins: jest.fn(async () => [])
};

export default pinService;
