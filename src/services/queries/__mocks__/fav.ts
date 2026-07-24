const mockGetFav = jest.fn();
const mockToggleFav = jest.fn(async (): Promise<void> => undefined);
export const useLazyFavQuery = jest.fn(() => [mockGetFav, { loading: false, called: false }]);
export const useFavMutation = jest.fn(() => [mockToggleFav, { loading: false }]);
