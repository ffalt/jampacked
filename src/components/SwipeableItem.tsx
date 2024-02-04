import React, {PropsWithChildren, ReactElement, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {useTheme} from '../style/theming';

const AnimatedView = Animated.createAnimatedComponent(View);

const styles = StyleSheet.create({
	actionIcons: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		flex: 1
	},
	rightAction: {
		flex: 1
	}
});

export const SwipeableItem: React.FC<PropsWithChildren<{ buttons: ReactElement }>> = ({buttons, children}) => {
	const containerRef = useRef<Swipeable | null>(null);
	const theme = useTheme();

	const close = (): void => {
		containerRef?.current?.close();
	};

	const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>): ReactElement => {
		const scale = dragX.interpolate({
			inputRange: [-80, 0],
			outputRange: [1, 0],
			extrapolate: 'clamp'
		});
		const trans = progress.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 0]
		});
		return (
			<RectButton style={[styles.rightAction, {backgroundColor: theme.control}]} onPress={close}>
				<AnimatedView style={[styles.actionIcons, {transform: [{scale}]}, {translateX: trans}]}>
					{buttons}
				</AnimatedView>
			</RectButton>
		);
	};

	return (
		<Swipeable
			ref={containerRef}
			friction={2}
			leftThreshold={80}
			enableTrackpadTwoFingerGesture
			rightThreshold={40}
			// renderLeftActions={this.renderLeftActions}
			renderRightActions={renderRightActions}>
			{children}
		</Swipeable>
	);
};
