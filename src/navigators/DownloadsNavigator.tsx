import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {ActiveDownloads} from '../components/ActiveDownloads';
import {DownloadsRoute} from './Routing';
import {PinnedMedia} from '../components/PinnedMedia';

const Tab = createMaterialTopTabNavigator();

export const DownloadsNavigator: React.FC = () => {
	return (
		<Tab.Navigator
			initialRouteName={DownloadsRoute.PINNED}
			lazy={true}
			tabBar={(): JSX.Element => (<></>)}
		>
			<Tab.Screen name={DownloadsRoute.PINNED} component={PinnedMedia}/>
			<Tab.Screen name={DownloadsRoute.ACTIVE} component={ActiveDownloads}/>
		</Tab.Navigator>
	);
};
