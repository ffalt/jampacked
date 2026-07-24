const actual = jest.requireActual<typeof import('../home')>('../home');

export const HomeQuery = actual.HomeQuery;
const mockGetHomeData = jest.fn();
export const useLazyHomeDataQuery = jest.fn(() => [mockGetHomeData, { loading: false, called: false }]);
