import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PlayerStrip } from '../components/PlayerStrip';
import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../style/theming';

export const TAB_BAR_ROW_HEIGHT = 42;
export const TAB_BAR_ICON_OFFSET = 2;

const styles = StyleSheet.create({
	background: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		height: TAB_BAR_ROW_HEIGHT
	},
	tabBar: {
		paddingTop: TAB_BAR_ICON_OFFSET * 2
	}
});

export const JamTabBarBackground: React.FC = () => {
	const theme = useTheme();
	return (<View style={[styles.background, { backgroundColor: theme.navigation.colors.card }]} />);
};

export const jamTabBarStyle = styles.tabBar;

export const JamTabBar: (props: BottomTabBarProps) => React.ReactNode = props => (
	<View>
		<PlayerStrip />
		<BottomTabBar {...props} style={{ height: TAB_BAR_ROW_HEIGHT + props.insets.bottom }} />
	</View>
);
