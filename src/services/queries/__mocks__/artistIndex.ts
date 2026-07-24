const actual = jest.requireActual<typeof import('../artistIndex')>('../artistIndex');

export const ArtistIndexQuery = actual.ArtistIndexQuery;
const mockGetArtistIndex = jest.fn();
export const useLazyArtistIndexQuery = jest.fn(() => [mockGetArtistIndex, { loading: false, called: false }]);
