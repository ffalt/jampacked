const mockGetRate = jest.fn();
const mockSetRate = jest.fn(async (): Promise<void> => undefined);
export const useLazyRateQuery = jest.fn(() => [mockGetRate, { loading: false, called: false }]);
export const useRateMutation = jest.fn(() => [mockSetRate, { loading: false }]);
