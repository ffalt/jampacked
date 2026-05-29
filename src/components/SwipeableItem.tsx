import React, { PropsWithChildren, ReactElement, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '../style/theming';

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

interface RightActionsProps {
	translation: SharedValue<number>;
	swipeableMethods: SwipeableMethods;
	buttons: ReactElement;
	backgroundColor: string;
}

const RightActions: React.FC<RightActionsProps> = ({ translation, swipeableMethods, buttons, backgroundColor }) => {
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: interpolate(translation.value, [-80, 0], [1, 0], Extrapolation.CLAMP) }]
	}));

	return (
		<Pressable style={[styles.rightAction, { backgroundColor }]} onPress={() => swipeableMethods.close()}>
			<Animated.View style={[styles.actionIcons, animatedStyle]}>
				{buttons}
			</Animated.View>
		</Pressable>
	);
};

export const SwipeableItem: React.FC<PropsWithChildren<{ buttons: ReactElement }>> = ({ buttons, children }) => {
	const containerReference = useRef<SwipeableMethods | null>(null);
	const theme = useTheme();

	const renderRightActions = (_progress: SharedValue<number>, translation: SharedValue<number>, swipeableMethods: SwipeableMethods): ReactElement =>
		<RightActions translation={translation} swipeableMethods={swipeableMethods} buttons={buttons} backgroundColor={theme.control} />;

	return (
		<ReanimatedSwipeable
			ref={containerReference}
			friction={2}
			leftThreshold={80}
			enableTrackpadTwoFingerGesture
			rightThreshold={40}
			renderRightActions={renderRightActions}>
			{children}
		</ReanimatedSwipeable>
	);
};
