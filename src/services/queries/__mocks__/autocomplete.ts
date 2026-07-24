const mockGetAutocomplete = jest.fn();
export const useLazyAutocompleteQuery = jest.fn(() => [mockGetAutocomplete, { loading: false, called: false }]);
