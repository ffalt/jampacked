import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import { AlbumTabNavigatorContext } from './AlbumNavigatorContext';
import {AlbumRoute, HomeRoute, HomeRouteProps} from './Routing';
import {AlbumScreen} from '../screens/AlbumScreen';

const Tab = createMaterialTopTabNavigator();

export const AlbumNavigator: React.FC<HomeRouteProps<HomeRoute.ALBUM>> = ({route}) => {
	return (
		<AlbumTabNavigatorContext.Provider value={route.params}>
			<Tab.Navigator
				initialRouteName={AlbumRoute.MAIN}
				screenOptions={{lazy: true}}
				tabBar={(): JSX.Element => (<></>)}
			>
				<Tab.Screen name={AlbumRoute.MAIN} component={AlbumScreen}/>
			</Tab.Navigator>
		</AlbumTabNavigatorContext.Provider>
	);
};
