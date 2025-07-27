import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { ArtistIndexScreen } from '../screens/ArtistIndexScreen';
import { ArtistListAvgHighestScreen, ArtistListFavScreen, ArtistListFrequentScreen, ArtistListHighestScreen, ArtistListRandomScreen, ArtistListRecentScreen } from '../screens/ArtistListScreen';
import { ArtistsRoute, ArtistsRouteParameterList } from './Routing';

const Tab = createMaterialTopTabNavigator<ArtistsRouteParameterList>();
const emptyComponent = (): React.JSX.Element => (<></>);

export const ArtistsNavigator: React.FC = () => (
	<Tab.Navigator
		initialRouteName={ArtistsRoute.INDEX}
		screenOptions={{ lazy: true }}
		tabBar={emptyComponent}
	>
		<Tab.Screen name={ArtistsRoute.INDEX} component={ArtistIndexScreen} />
		<Tab.Screen name={ArtistsRoute.FAV} component={ArtistListFavScreen} />
		<Tab.Screen name={ArtistsRoute.RECENT} component={ArtistListRecentScreen} />
		<Tab.Screen name={ArtistsRoute.FREQUENT} component={ArtistListFrequentScreen} />
		<Tab.Screen name={ArtistsRoute.RANDOM} component={ArtistListRandomScreen} />
		<Tab.Screen name={ArtistsRoute.HIGHEST} component={ArtistListHighestScreen} />
		<Tab.Screen name={ArtistsRoute.AVGHIGHEST} component={ArtistListAvgHighestScreen} />
	</Tab.Navigator>
);
