import React from 'react';
import { View } from 'react-native';
import { PlayerStrip } from '../components/PlayerStrip';
import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const JamTabBar: (props: BottomTabBarProps) => React.ReactNode = props => (
	<View>
		<PlayerStrip />
		<BottomTabBar {...props} />
	</View>
);
