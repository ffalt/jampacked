const actual = jest.requireActual<typeof import('../../src/components/TrackItem.tsx')>('../../src/components/TrackItem.tsx');

export const defaultTrackDisplay = jest.fn(actual.defaultTrackDisplay);
export const defaultShowArtistTrackDisplay = jest.fn(actual.defaultShowArtistTrackDisplay);
export const defaultListTrackDisplay = jest.fn(actual.defaultListTrackDisplay);
export const TrackItem = jest.fn(() => null);
