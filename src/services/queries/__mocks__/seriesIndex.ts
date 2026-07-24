const actual = jest.requireActual<typeof import('../seriesIndex')>('../seriesIndex');

export const SeriesIndexQuery = actual.SeriesIndexQuery;
const mockGetSeriesIndex = jest.fn();
export const useLazySeriesIndexQuery = jest.fn(() => [mockGetSeriesIndex, { loading: false, called: false }]);
