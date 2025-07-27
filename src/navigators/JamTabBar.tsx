import React from 'react';
import { View } from 'react-native';
import { PlayerStrip } from '../components/PlayerStrip';
import { BottomTabBar, BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const JamTabBar: React.FC<BottomTabBarProps> = (props: BottomTabBarProps): React.ReactNode => (
	<View>
		<PlayerStrip />
		<BottomTabBar {...props} />
	</View>
);
