import React, {useState} from 'react';
import {Animated, StyleProp, Text, TouchableWithoutFeedback, ViewStyle} from 'react-native';
import {useScaleAnimate} from '../utils/scale.animate.hook';

export const LoginButton: React.FC<{
	style: StyleProp<ViewStyle>;
	onPress: () => void;
	label?: string;
}> = ({children, label, onPress, style}) => {
	const [inverted, setInverted] = useState(false);
	const scale = useScaleAnimate(inverted);

	const onPressButton = (): void => {
		setInverted(true);
		if (onPress) {
			onPress();
		}
	};

	const content = children || <Text>{label}</Text>;
	return (
		<TouchableWithoutFeedback onPress={onPressButton}>
			<Animated.View style={[style, {transform: [{scale}]}]}>
				{content}
			</Animated.View>
		</TouchableWithoutFeedback>
	);
};
