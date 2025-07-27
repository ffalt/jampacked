import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { TracksRoute, TracksRouteParameterList } from './Routing';
import { TrackListAvgHighestScreen, TrackListFavScreen, TrackListFrequentScreen, TrackListHighestScreen, TrackListRandomScreen, TrackListRecentScreen } from '../screens/TrackListScreen';

const Tab = createMaterialTopTabNavigator<TracksRouteParameterList>();
const emptyComponent = (): React.JSX.Element => (<></>);

export const TracksNavigator: React.FC = () => (
	<Tab.Navigator
		initialRouteName={TracksRoute.FAV}
		screenOptions={{ lazy: true }}
		tabBar={emptyComponent}
	>
		<Tab.Screen name={TracksRoute.FAV} component={TrackListFavScreen} />
		<Tab.Screen name={TracksRoute.RECENT} component={TrackListRecentScreen} />
		<Tab.Screen name={TracksRoute.FREQUENT} component={TrackListFrequentScreen} />
		<Tab.Screen name={TracksRoute.RANDOM} component={TrackListRandomScreen} />
		<Tab.Screen name={TracksRoute.HIGHEST} component={TrackListHighestScreen} />
		<Tab.Screen name={TracksRoute.AVGHIGHEST} component={TrackListAvgHighestScreen} />
	</Tab.Navigator>
);
