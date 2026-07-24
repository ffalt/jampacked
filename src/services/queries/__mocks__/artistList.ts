const actual = jest.requireActual<typeof import('../artistList')>('../artistList');

export const ArtistListQuery = actual.ArtistListQuery;
const mockGetArtistList = jest.fn();
export const useLazyArtistListQuery = jest.fn(() => [mockGetArtistList, { loading: false, called: false }]);
