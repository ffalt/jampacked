const mockGetSearch = jest.fn();
export const useLazySearchQuery = jest.fn(() => [mockGetSearch, { loading: false, called: false }]);
