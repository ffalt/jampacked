import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {SeriesIndexScreen} from '../screens/SeriesIndexScreen';
import {SeriesListAvgHighestScreen, SeriesListFavScreen, SeriesListFrequentScreen, SeriesListHighestScreen, SeriesListRandomScreen, SeriesListRecentScreen} from '../screens/SeriesListScreen';
import {HomeRoute, HomeRouteProps, SeriesRoute, SeriesRouteParamList} from './Routing';

const Tab = createMaterialTopTabNavigator<SeriesRouteParamList>();
const emptyComponent = (): JSX.Element => (<></>);

export const SeriesNavigator: React.FC<HomeRouteProps<HomeRoute.SERIES>> = () => {
	return (
		<Tab.Navigator
			initialRouteName={SeriesRoute.INDEX}
			screenOptions={{lazy: true}}
			tabBar={emptyComponent}
		>
			<Tab.Screen name={SeriesRoute.INDEX} component={SeriesIndexScreen}/>
			<Tab.Screen name={SeriesRoute.FAV} component={SeriesListFavScreen}/>
			<Tab.Screen name={SeriesRoute.RECENT} component={SeriesListRecentScreen}/>
			<Tab.Screen name={SeriesRoute.FREQUENT} component={SeriesListFrequentScreen}/>
			<Tab.Screen name={SeriesRoute.RANDOM} component={SeriesListRandomScreen}/>
			<Tab.Screen name={SeriesRoute.HIGHEST} component={SeriesListHighestScreen}/>
			<Tab.Screen name={SeriesRoute.AVGHIGHEST} component={SeriesListAvgHighestScreen}/>
		</Tab.Navigator>
	);
};
