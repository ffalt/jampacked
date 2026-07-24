const FastImage = jest.fn(() => null) as jest.Mock & {
	resizeMode: { contain: string; cover: string; stretch: string; center: string };
	priority: { low: string; normal: string; high: string };
	cacheControl: { immutable: string; web: string; cacheOnly: string };
};

FastImage.resizeMode = { contain: 'contain', cover: 'cover', stretch: 'stretch', center: 'center' };
FastImage.priority = { low: 'low', normal: 'normal', high: 'high' };
FastImage.cacheControl = { immutable: 'immutable', web: 'web', cacheOnly: 'cacheOnly' };

export default FastImage;
