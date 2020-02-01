import React from 'react';
import {BottomTabBar, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';
import HomeStackNavigator from './HomeStackNavigator';
import UserScreen from '../screens/UserScreen';
import {BottomTabParams, BottomTabRoute} from './Routing';
import SearchScreen from '../screens/SearchScreen';
import PlayerStrip from '../components/PlayerStrip';
import {getTabBarIcon} from '../components/ThemedIcon';

const BottomTabs = createBottomTabNavigator<BottomTabParams>();

const JamTabBar: React.FC<any> = (props: any) => (
	<View>
		<PlayerStrip/>
		<BottomTabBar {...props} showLabel={false} />
	</View>
);

const BottomTabNavigator: React.FC = () => (
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
			component={UserScreen}
			options={{tabBarIcon: getTabBarIcon('user')}}
		/>
	</BottomTabs.Navigator>
);

export default BottomTabNavigator;
