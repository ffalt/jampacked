const dimensions = { width: 360, height: 640, scale: 2, fontScale: 1, isLandscape: false };

export const useScreenDimensions = jest.fn(() => dimensions);
export const useWindowDimensions = jest.fn(() => dimensions);
export const useWindowWidth = jest.fn(() => dimensions.width);
