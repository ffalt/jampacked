import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {ArtistIndexScreen} from '../screens/ArtistIndexScreen';
import {ArtistListAvgHighestScreen, ArtistListFavScreen, ArtistListFrequentScreen, ArtistListHighestScreen, ArtistListRandomScreen, ArtistListRecentScreen} from '../screens/ArtistListScreen';
import {ArtistsRoute} from './Routing';

const Tab = createMaterialTopTabNavigator();

export const ArtistsNavigator: React.FC = () => {
	return (
		<Tab.Navigator
			initialRouteName={ArtistsRoute.INDEX}
			lazy={true}
			tabBar={(): JSX.Element => (<></>)}
		>
			<Tab.Screen name={ArtistsRoute.INDEX} component={ArtistIndexScreen}/>
			<Tab.Screen name={ArtistsRoute.FAV} component={ArtistListFavScreen}/>
			<Tab.Screen name={ArtistsRoute.RECENT} component={ArtistListRecentScreen}/>
			<Tab.Screen name={ArtistsRoute.FREQUENT} component={ArtistListFrequentScreen}/>
			<Tab.Screen name={ArtistsRoute.RANDOM} component={ArtistListRandomScreen}/>
			<Tab.Screen name={ArtistsRoute.HIGHEST} component={ArtistListHighestScreen}/>
			<Tab.Screen name={ArtistsRoute.AVGHIGHEST} component={ArtistListAvgHighestScreen}/>
		</Tab.Navigator>
	);
};
