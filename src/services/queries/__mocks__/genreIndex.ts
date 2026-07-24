const actual = jest.requireActual<typeof import('../genreIndex')>('../genreIndex');

export const GenreIndexQuery = actual.GenreIndexQuery;
const mockGetGenreIndex = jest.fn();
export const useLazyGenreIndexQuery = jest.fn(() => [mockGetGenreIndex, { loading: false, called: false }]);
