const cacheService = {
	updateHomeData: jest.fn(),
	subscribeHomeDataChangeUpdates: jest.fn(),
	unsubscribeHomeDataChangeUpdates: jest.fn(),
	removeKeyStartWith: jest.fn().mockResolvedValue(undefined)
};
export default cacheService;
