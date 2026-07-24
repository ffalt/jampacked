/** Full `NavigationService` surface so a test never has to enumerate the methods it needs. */
export const NavigationService = {
	setTopLevelNavigator: jest.fn(),
	goBack: jest.fn(),
	navigateToChild: jest.fn(),
	navigateToHomeScreen: jest.fn(),
	navigate: jest.fn(),
	navigateTo: jest.fn(),
	navigateLink: jest.fn(),
	routeByObjType: jest.fn(),
	navigateObj: jest.fn()
};
