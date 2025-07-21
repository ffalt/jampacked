import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { DownloadsActiveScreen } from '../screens/DownloadsActiveScreen';
import { DownloadsRoute, DownloadsRouteParamList } from './Routing';
import { PinnedMediaScreen } from '../screens/PinnedMediaScreen';
import { DownloadsScreen } from '../screens/DownloadsScreen';

const Tab = createMaterialTopTabNavigator<DownloadsRouteParamList>();
const emptyComponent = (): React.JSX.Element => (<></>);

export const DownloadsNavigator: React.FC = () => {
	return (
		<Tab.Navigator
			initialRouteName={DownloadsRoute.PINNED}
			screenOptions={{ lazy: true }}
			tabBar={emptyComponent}
		>
			<Tab.Screen name={DownloadsRoute.PINNED} component={PinnedMediaScreen}/>
			<Tab.Screen name={DownloadsRoute.ACTIVE} component={DownloadsActiveScreen}/>
			<Tab.Screen name={DownloadsRoute.ALL} component={DownloadsScreen}/>
		</Tab.Navigator>
	);
};
