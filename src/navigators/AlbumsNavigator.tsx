import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {AlbumIndexScreen} from '../screens/AlbumIndexScreen';
import {AlbumListAvgHighestScreen, AlbumListFavScreen, AlbumListFrequentScreen, AlbumListHighestScreen, AlbumListRandomScreen, AlbumListRecentScreen} from '../screens/AlbumListScreen';
import {AlbumsTabNavigatorContext} from './AlbumsNavigatorContext';
import {AlbumsRoute, HomeRoute, HomeRouteProps} from './Routing';

const Tab = createMaterialTopTabNavigator();

export const AlbumsNavigator: React.FC<HomeRouteProps<HomeRoute.ALBUMS>> = ({route}) => {
	return (
		<AlbumsTabNavigatorContext.Provider value={{albumType: route.params.albumType}}>
			<Tab.Navigator
				initialRouteName={AlbumsRoute.INDEX}
				lazy={true}
				tabBar={(): JSX.Element => (<></>)}
			>
				<Tab.Screen name={AlbumsRoute.INDEX} component={AlbumIndexScreen}/>
				<Tab.Screen name={AlbumsRoute.FAV} component={AlbumListFavScreen}/>
				<Tab.Screen name={AlbumsRoute.RECENT} component={AlbumListRecentScreen}/>
				<Tab.Screen name={AlbumsRoute.FREQUENT} component={AlbumListFrequentScreen}/>
				<Tab.Screen name={AlbumsRoute.RANDOM} component={AlbumListRandomScreen}/>
				<Tab.Screen name={AlbumsRoute.HIGHEST} component={AlbumListHighestScreen}/>
				<Tab.Screen name={AlbumsRoute.AVGHIGHEST} component={AlbumListAvgHighestScreen}/>
			</Tab.Navigator>
		</AlbumsTabNavigatorContext.Provider>
	);
};
