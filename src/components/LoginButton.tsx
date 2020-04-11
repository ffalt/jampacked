import React, {ReactNode} from 'react';
import {Animated, Easing, StyleProp, Text, TouchableWithoutFeedback, ViewStyle} from 'react-native';

export default class LoginButton extends React.PureComponent<{
	children?: ReactNode | Array<ReactNode>;
	style: StyleProp<ViewStyle>;
	onPress: () => void;
	label?: string;
}> {
	scaleValue = new Animated.Value(0);

	private scale(): void {
		this.scaleValue.setValue(0);
		Animated.timing(
			this.scaleValue,
			{
				toValue: 1,
				duration: 300,
				easing: Easing.bounce,
				useNativeDriver: false
			}
		).start();
	}

	private onPressButton = (): void => {
		this.scale();
		const {onPress} = this.props;
		if (onPress) {
			onPress();
		}
	};

	render(): React.ReactElement {
		const {children, label, style} = this.props;
		const content = children || <Text>{label}</Text>;
		const scale = this.scaleValue.interpolate({
			inputRange: [0, 0.5, 1],
			outputRange: [1, 1.1, 1]
		});
		return (
			<TouchableWithoutFeedback onPress={this.onPressButton}>
				<Animated.View style={[style, {transform: [{scale}]}]}>
					{content}
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}
