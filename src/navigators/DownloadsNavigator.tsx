import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {DownloadsActiveScreen} from '../screens/DownloadsActiveScreen';
import {DownloadsRoute, DownloadsRouteParamList} from './Routing';
import {DownloadsPinnedScreen} from '../screens/DownloadsPinnedScreen';

const Tab = createMaterialTopTabNavigator<DownloadsRouteParamList>();
const emptyComponent = (): JSX.Element => (<></>);

export const DownloadsNavigator: React.FC = () => {
	return (
		<Tab.Navigator
			initialRouteName={DownloadsRoute.PINNED}
			screenOptions={{lazy: true}}
			tabBar={emptyComponent}
		>
			<Tab.Screen name={DownloadsRoute.PINNED} component={DownloadsPinnedScreen}/>
			<Tab.Screen name={DownloadsRoute.ACTIVE} component={DownloadsActiveScreen}/>
		</Tab.Navigator>
	);
};
