import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackNavigator } from './HomeStackNavigator';
import { SettingsScreen } from '../screens/SettingsScreen';
import { BottomTabNavigatorParamList, BottomTabRoute, ModalRouting, ModalStackProps } from './Routing';
import { getTabBarIcon } from '../components/ThemedIcon';
import { JamTabBar } from './JamTabBar';
import { QueueScreen } from '../screens/QueueScreen';

const BottomTabs = createBottomTabNavigator<BottomTabNavigatorParamList>();

export const BottomTabNavigator: React.FC<ModalStackProps<ModalRouting.MAIN>> = () => (
	<BottomTabs.Navigator
		screenOptions={{
			headerShown: false,
			tabBarShowLabel: false
		}}
		tabBar={JamTabBar}>
		<BottomTabs.Screen
			name={BottomTabRoute.HOME}
			component={HomeStackNavigator}
			options={{ tabBarIcon: getTabBarIcon('home') }}
		/>
		<BottomTabs.Screen
			name={BottomTabRoute.QUEUE}
			component={QueueScreen}
			options={{ tabBarIcon: getTabBarIcon('queue') }}
		/>
		<BottomTabs.Screen
			name={BottomTabRoute.SETTINGS}
			component={SettingsScreen}
			options={{ tabBarIcon: getTabBarIcon('settings') }}
		/>
	</BottomTabs.Navigator>
);
