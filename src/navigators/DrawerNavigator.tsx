import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {ModalNavigator} from './ModalNavigator';
import {AppDrawer} from '../components/AppDrawer';

const Drawer = createDrawerNavigator();
const AppDrawerComponent = (): JSX.Element => <AppDrawer/>;

export const DrawerNavigator: React.FC = () => {
	return (
		<Drawer.Navigator
			initialRouteName="Drawer"
			screenOptions={{headerShown: false}}
			drawerContent={AppDrawerComponent}
		>
			<Drawer.Screen name="Drawer" component={ModalNavigator}/>
		</Drawer.Navigator>
	);
};
