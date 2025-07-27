import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { GenresRoute, GenresRouteParameterList, HomeRoute, HomeRouteProps } from './Routing';
import { GenreIndexScreen } from '../screens/GenreIndexScreen';

const Tab = createMaterialTopTabNavigator<GenresRouteParameterList>();
const emptyComponent = (): React.JSX.Element => (<></>);

export const GenresNavigator: React.FC<HomeRouteProps<HomeRoute.GENRES>> = () => (
	<Tab.Navigator
		initialRouteName={GenresRoute.INDEX}
		screenOptions={{ lazy: true }}
		tabBar={emptyComponent}
	>
		<Tab.Screen name={GenresRoute.INDEX} component={GenreIndexScreen} />
	</Tab.Navigator>
);
