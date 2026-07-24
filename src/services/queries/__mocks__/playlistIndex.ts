const actual = jest.requireActual<typeof import('../playlistIndex')>('../playlistIndex');

export const PlaylistIndexQuery = actual.PlaylistIndexQuery;
const mockGetPlaylistIndex = jest.fn();
export const useLazyPlaylistIndexQuery = jest.fn(() => [mockGetPlaylistIndex, { loading: false, called: false }]);
