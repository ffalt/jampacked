const actual = jest.requireActual<typeof import('../trackList')>('../trackList');

export const TrackListQuery = actual.TrackListQuery;
const mockGetTrackList = jest.fn();
export const useLazyTrackListQuery = jest.fn(() => [mockGetTrackList, { loading: false, called: false }]);
