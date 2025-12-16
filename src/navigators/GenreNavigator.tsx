import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useMemo } from 'react';
import { GenreRoute, GenreRouteParameterList, HomeRoute, HomeRouteProps } from './Routing';
import { GenreArtistsScreen } from '../screens/GenreArtistsScreen';
import { GenreAlbumsScreen } from '../screens/GenreAlbumsScreen';
import { GenreTracksScreen } from '../screens/GenreTracksScreen';
import { GenreTabNavigatorContext } from './GenreNavigatorContext';

const Tab = createMaterialTopTabNavigator<GenreRouteParameterList>();
const emptyComponent = (): React.JSX.Element => (<></>);

export const GenreNavigator: React.FC<HomeRouteProps<HomeRoute.GENRE>> = ({ route }) => {
	const state = useMemo(() => ({ id: route.params?.id, name: route.params?.name }), [route.params]);
	return (
		<GenreTabNavigatorContext.Provider value={state}>
			<Tab.Navigator
				initialRouteName={GenreRoute.ARTISTS}
				screenOptions={{ lazy: true }}
				tabBar={emptyComponent}
			>
				<Tab.Screen name={GenreRoute.ARTISTS} component={GenreArtistsScreen} />
				<Tab.Screen name={GenreRoute.ALBUMS} component={GenreAlbumsScreen} />
				<Tab.Screen name={GenreRoute.TRACKS} component={GenreTracksScreen} />
			</Tab.Navigator>
		</GenreTabNavigatorContext.Provider>
	);
};
