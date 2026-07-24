const actual = jest.requireActual<typeof import('../album')>('../album');

export const AlbumQuery = actual.AlbumQuery;
const mockGetAlbum = jest.fn();
export const useLazyAlbumQuery = jest.fn(() => [mockGetAlbum, { loading: false, called: false }]);
