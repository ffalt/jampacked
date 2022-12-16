import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect, useState} from 'react';
import {AlbumIndexScreen} from '../screens/AlbumIndexScreen';
import {AlbumListAvgHighestScreen, AlbumListFavScreen, AlbumListFrequentScreen, AlbumListHighestScreen, AlbumListRandomScreen, AlbumListRecentScreen} from '../screens/AlbumListScreen';
import {AlbumsTabNavigatorContext} from './AlbumsNavigatorContext';
import {AlbumsRoute, HomeRoute, HomeRouteProps} from './Routing';
import {AlbumType} from '../services/jam';

const Tab = createMaterialTopTabNavigator();
const emptyComponent = (): JSX.Element => (<></>);

export const AlbumsNavigator: React.FC<HomeRouteProps<HomeRoute.ALBUMS>> = ({route}) => {
	const [albumType, setAlbumType] = useState<AlbumType | undefined>();

	useEffect(() => {
		setAlbumType(route.params.albumType);
	}, [route]);

	return (
		<AlbumsTabNavigatorContext.Provider value={{albumType}}>
			<Tab.Navigator
				initialRouteName={AlbumsRoute.INDEX}
				screenOptions={{lazy: true}}
				tabBar={emptyComponent}
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
