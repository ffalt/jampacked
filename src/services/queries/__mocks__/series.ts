const actual = jest.requireActual<typeof import('../series')>('../series');

export const SeriesQuery = actual.SeriesQuery;
const mockGetSeries = jest.fn();
export const useLazySeriesQuery = jest.fn(() => [mockGetSeries, { loading: false, called: false }]);
