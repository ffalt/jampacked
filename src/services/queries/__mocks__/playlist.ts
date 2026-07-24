const actual = jest.requireActual<typeof import('../playlist')>('../playlist');

export const PlaylistQuery = actual.PlaylistQuery;
export const transformEpisode = actual.transformEpisode;
const mockGetPlaylist = jest.fn();
export const useLazyPlaylistQuery = jest.fn(() => [mockGetPlaylist, { loading: false, called: false }]);
