import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { FolderIndexScreen } from '../screens/FolderIndexScreen';
import { FolderListAvgHighestScreen, FolderListFavScreen, FolderListFrequentScreen, FolderListHighestScreen, FolderListRandomScreen, FolderListRecentScreen } from '../screens/FolderListScreen';
import { FoldersTabNavigatorContext } from './FoldersNavigatorContext';
import { FoldersRoute, FoldersRouteParamList, HomeRoute, HomeRouteProps } from './Routing';

const Tab = createMaterialTopTabNavigator<FoldersRouteParamList>();
const emptyComponent = (): React.JSX.Element => (<></>);

export const FoldersNavigator: React.FC<HomeRouteProps<HomeRoute.FOLDERS>> = ({ route }) => {
	return (
		<FoldersTabNavigatorContext.Provider value={{ albumType: route.params?.albumType }}>
			<Tab.Navigator
				initialRouteName={FoldersRoute.INDEX}
				screenOptions={{ lazy: true }}
				tabBar={emptyComponent}
			>
				<Tab.Screen name={FoldersRoute.INDEX} component={FolderIndexScreen}/>
				<Tab.Screen name={FoldersRoute.FAV} component={FolderListFavScreen}/>
				<Tab.Screen name={FoldersRoute.RECENT} component={FolderListRecentScreen}/>
				<Tab.Screen name={FoldersRoute.FREQUENT} component={FolderListFrequentScreen}/>
				<Tab.Screen name={FoldersRoute.RANDOM} component={FolderListRandomScreen}/>
				<Tab.Screen name={FoldersRoute.HIGHEST} component={FolderListHighestScreen}/>
				<Tab.Screen name={FoldersRoute.AVGHIGHEST} component={FolderListAvgHighestScreen}/>
			</Tab.Navigator>
		</FoldersTabNavigatorContext.Provider>
	);
};
