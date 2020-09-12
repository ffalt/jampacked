import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {ModalNavigator} from './ModalNavigator';
import {AppDrawer} from '../components/AppDrawer';

const Drawer = createDrawerNavigator();

export const DrawerNavigator: React.FC = () => {
	return (
		<Drawer.Navigator
			initialRouteName="Drawer"
			drawerContent={(_): JSX.Element => <AppDrawer/>}
		>
			<Drawer.Screen name="Drawer" component={ModalNavigator}/>
		</Drawer.Navigator>
	);
};
