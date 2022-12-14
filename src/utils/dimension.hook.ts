import {useEffect, useState} from 'react';
import {Dimensions, ScaledSize} from 'react-native';

export const useScreenDimensions = (): (ScaledSize & { isLandscape: boolean }) => {
	const [screenData, setScreenData] = useState(Dimensions.get('screen'));

	useEffect(() => {
		const onChange = (result: { window: ScaledSize; screen: ScaledSize }): void => {
			setScreenData(result.screen);
		};

		const dimensionsSubscription = Dimensions.addEventListener('change', onChange);
		return (): void => dimensionsSubscription.remove();
	});

	return {
		...screenData,
		isLandscape: screenData.width > screenData.height
	};
};

export const useWindowDimensions = (): (ScaledSize & { isLandscape: boolean }) => {
	const [windowData, setWindowData] = useState(Dimensions.get('window'));

	useEffect(() => {
		const onChange = (result: { window: ScaledSize; screen: ScaledSize }): void => {
			setWindowData(result.window);
		};

		const dimensionsSubscription = Dimensions.addEventListener('change', onChange);
		return (): void => dimensionsSubscription.remove();
	});

	return {
		...windowData,
		isLandscape: windowData.width > windowData.height
	};
};

export const useWindowWidth = (): number => {
	const [width, setWidth] = useState(Dimensions.get('window').width);

	useEffect(() => {
		const onChange = (result: { window: ScaledSize; screen: ScaledSize }): void => {
			setWidth(result.window.width);
		};

		const dimensionsSubscription = Dimensions.addEventListener('change', onChange);
		return (): void => dimensionsSubscription.remove();
	});

	return width;
};
