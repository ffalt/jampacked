const actual = jest.requireActual<typeof import('../albumIndex')>('../albumIndex');

export const AlbumIndexQuery = actual.AlbumIndexQuery;
const mockGetAlbumIndex = jest.fn();
export const useLazyAlbumIndexQuery = jest.fn(() => [mockGetAlbumIndex, { loading: false, called: false }]);
