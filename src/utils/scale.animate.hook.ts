import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export const useScaleAnimate = (inverted = false, avoidFirst = true): Animated.AnimatedInterpolation<number> => {
	const scaleValue = useRef(new Animated.Value(0)).current;

	const scale = scaleValue.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [1, 1.1, 1]
	});
	const [isFirst, setIsFirst] = useState(true);

	useEffect(() => {
		if (!avoidFirst || !isFirst) {
			Animated.timing(scaleValue, { toValue: inverted ? 1 : 0, duration: 200, easing: Easing.bounce, useNativeDriver: true }).start();
		}
		setIsFirst(false);
	}, [avoidFirst, inverted, isFirst, scaleValue]);

	return scale;
};
