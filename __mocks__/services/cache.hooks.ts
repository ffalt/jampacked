const noop = jest.fn();

export const useCacheOrLazyQuery = jest.fn(() => [noop, { loading: false, called: false }]);

export const useCacheManagement = jest.fn(() => [
	jest.fn(),
	jest.fn(),
	jest.fn(),
	{ isRunning: false, isStopped: false, message: '' }
]);
