const actual = jest.requireActual<typeof import('../lyrics')>('../lyrics');

export const TrackLyricsQuery = actual.TrackLyricsQuery;
export const transformData = actual.transformData;
const mockGetTrackLyrics = jest.fn();
export const useLazyTrackLyricsQuery = jest.fn(() => [mockGetTrackLyrics, { loading: false, called: false }]);
