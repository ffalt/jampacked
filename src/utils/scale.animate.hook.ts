import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export const useScaleAnimate = (inverted = false, avoidFirst = true): Animated.AnimatedInterpolation<number> => {
	const [scaleValue] = useState(() => new Animated.Value(0));
	const isFirstReference = useRef(true);

	const scale = scaleValue.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [1, 1.1, 1]
	});

	useEffect(() => {
		if (!avoidFirst || !isFirstReference.current) {
			Animated.timing(scaleValue, {
				toValue: inverted ? 1 : 0,
				duration: 200,
				easing: Easing.bounce,
				useNativeDriver: true
			}).start();
		}
		isFirstReference.current = false;
	}, [avoidFirst, inverted, scaleValue]);

	return scale;
};
