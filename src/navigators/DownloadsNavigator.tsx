import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {ActiveDownloads} from '../components/ActiveDownloadItem';
import {DownloadsRoute} from './Routing';

const Tab = createMaterialTopTabNavigator();

export const DownloadsNavigator: React.FC = () => {
	return (
		<Tab.Navigator
			initialRouteName={DownloadsRoute.ACTIVE}
			lazy={true}
			tabBar={(): JSX.Element => (<></>)}
		>
			<Tab.Screen name={DownloadsRoute.ACTIVE} component={ActiveDownloads}/>
		</Tab.Navigator>
	);
};
