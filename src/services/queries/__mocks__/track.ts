const actual = jest.requireActual<typeof import('../track')>('../track');

export const TrackQuery = actual.TrackQuery;
export const transformTrack = actual.transformTrack;
export const transformData = actual.transformData;
const mockGetTrack = jest.fn();
export const useLazyTrackQuery = jest.fn(() => [mockGetTrack, { loading: false, called: false }]);
