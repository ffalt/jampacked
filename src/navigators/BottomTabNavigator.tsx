import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeStackNavigator} from './HomeStackNavigator';
import {SettingsScreen} from '../screens/SettingsScreen';
import {BottomTabParams, BottomTabRoute} from './Routing';
import {SearchScreen} from '../screens/SearchScreen';
import {getTabBarIcon} from '../components/ThemedIcon';
import {JamTabBar} from './JamTabBar';

const BottomTabs = createBottomTabNavigator<BottomTabParams>();

export const BottomTabNavigator: React.FC = () => (
	<BottomTabs.Navigator tabBar={JamTabBar}>
		<BottomTabs.Screen
			name={BottomTabRoute.HOME}
			component={HomeStackNavigator}
			options={{tabBarIcon: getTabBarIcon('home')}}
		/>
		<BottomTabs.Screen
			name={BottomTabRoute.SEARCH}
			component={SearchScreen}
			options={{tabBarIcon: getTabBarIcon('search')}}
		/>
		<BottomTabs.Screen
			name={BottomTabRoute.SETTINGS}
			component={SettingsScreen}
			options={{tabBarIcon: getTabBarIcon('settings')}}
		/>
	</BottomTabs.Navigator>
);
