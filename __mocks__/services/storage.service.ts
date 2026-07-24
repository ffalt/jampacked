const storageService = {
	init: jest.fn(async (): Promise<void> => undefined),
	checkDB: jest.fn(async (): Promise<void> => undefined),
	getValue: jest.fn(async (): Promise<string | undefined> => undefined),
	setValue: jest.fn(async (): Promise<void> => undefined),
	getSetting: jest.fn(async (): Promise<string | undefined> => undefined),
	setSetting: jest.fn(async (): Promise<void> => undefined),
	getStored: jest.fn(async (): Promise<string | undefined> => undefined),
	setStored: jest.fn(async (): Promise<void> => undefined)
};

export default storageService;
