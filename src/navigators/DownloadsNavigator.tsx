import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { DownloadsActiveScreen } from '../screens/DownloadsActiveScreen';
import { DownloadsRoute, DownloadsRouteParameterList } from './Routing';
import { PinnedMediaScreen } from '../screens/PinnedMediaScreen';
import { DownloadsScreen } from '../screens/DownloadsScreen';

const Tab = createMaterialTopTabNavigator<DownloadsRouteParameterList>();
const emptyComponent = (): React.JSX.Element => (<></>);

export const DownloadsNavigator: React.FC = () => (
	<Tab.Navigator
		initialRouteName={DownloadsRoute.PINNED}
		screenOptions={{ lazy: true }}
		tabBar={emptyComponent}
	>
		<Tab.Screen name={DownloadsRoute.PINNED} component={PinnedMediaScreen} />
		<Tab.Screen name={DownloadsRoute.ACTIVE} component={DownloadsActiveScreen} />
		<Tab.Screen name={DownloadsRoute.ALL} component={DownloadsScreen} />
	</Tab.Navigator>
);
