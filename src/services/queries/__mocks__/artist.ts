const actual = jest.requireActual<typeof import('../artist')>('../artist');

export const ArtistQuery = actual.ArtistQuery;
const mockGetArtist = jest.fn();
export const useLazyArtistQuery = jest.fn(() => [mockGetArtist, { loading: false, called: false }]);
