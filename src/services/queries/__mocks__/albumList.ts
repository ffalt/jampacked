const actual = jest.requireActual<typeof import('../albumList')>('../albumList');

export const AlbumListQuery = actual.AlbumListQuery;
const mockGetAlbumList = jest.fn();
export const useLazyAlbumListQuery = jest.fn(() => [mockGetAlbumList, { loading: false, called: false }]);
