import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect, useState} from 'react';
import {GenreRoute, HomeRoute, HomeRouteProps} from './Routing';
import {GenreArtistsScreen} from '../screens/GenreArtistsScreen';
import {GenreAlbumsScreen} from '../screens/GenreAlbumsScreen';
import {GenreTracksScreen} from '../screens/GenreTracksScreen';
import {GenreTabNavigatorContext} from './GenreNavigatorContext';

const Tab = createMaterialTopTabNavigator();

export const GenreNavigator: React.FC<HomeRouteProps<HomeRoute.GENRE>> = ({route}) => {
	const [state, setState] = useState<{ id?: string, name?: string }>({});

	useEffect(() => {
		setState({id: route.params?.id, name: route.params?.name});
	}, [route]);
	return (
		<GenreTabNavigatorContext.Provider value={state}>
			<Tab.Navigator
				initialRouteName={GenreRoute.ARTISTS}
				screenOptions={{lazy: true}}
				tabBar={(): JSX.Element => (<></>)}
			>
				<Tab.Screen name={GenreRoute.ARTISTS} component={GenreArtistsScreen}/>
				<Tab.Screen name={GenreRoute.ALBUMS} component={GenreAlbumsScreen}/>
				<Tab.Screen name={GenreRoute.TRACKS} component={GenreTracksScreen}/>
			</Tab.Navigator>
		</GenreTabNavigatorContext.Provider>
	);
};
