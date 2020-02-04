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
				easing: Easing.bounce
			}
		).start();
	}

	private onPress = (): void => {
		this.scale();
		this.props.onPress();
	};

	render(): React.ReactElement {

		const content = this.props.children ? this.props.children : <Text>{this.props.label}</Text>;

		const buttonScale = this.scaleValue.interpolate({
			inputRange: [0, 0.5, 1],
			outputRange: [1, 1.1, 1]
		});

		return (
			<TouchableWithoutFeedback onPress={this.onPress}>
				<Animated.View style={[this.props.style, {transform: [{scale: buttonScale}]}]}>
					{content}
				</Animated.View>
			</TouchableWithoutFeedback>
		);
	}
}
