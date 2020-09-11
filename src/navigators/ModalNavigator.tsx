import React, {useCallback, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabNavigator} from './BottomTabNavigator';
import {PlayerScreen} from '../screens/PlayerScreen';
import SideMenu from 'react-native-side-menu-updated';
import {AppDrawer} from '../components/AppDrawer';
import {ModalRouting} from './Routing';
import {NavigationService} from '../services/navigation';
import {Linking} from 'react-native';

const ModalStack = createStackNavigator();

export const ModalNavigator: React.FC = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

	useEffect(() => {
		let isSubscribed = true;

		const handleUrl = (data?: { url: string | null }): void => {
			if (data?.url === 'trackplayer://notification.click') {
				NavigationService.navigate(ModalRouting.PLAYER);
			}
		};

		Linking.getInitialURL().then((url) => {
			if (isSubscribed) {
				handleUrl({url});
			}
		});
		Linking.addEventListener('url', data => {
			if (isSubscribed) {
				handleUrl(data);
			}
		});

		return (): void => {
			isSubscribed = false;
			Linking.removeEventListener('url', handleUrl);
		};
	}, []);

	useEffect(() => {
		let isSubscribed = true;

		const setSidebar = (open: boolean): void => {
			if (isSubscribed) {
				setIsSidebarOpen(open);
			}
		};

		NavigationService.setSidebarControl(() => {
			setSidebar(true);
		}, () => {
			setSidebar(false);
		});

		return (): void => {
			NavigationService.setSidebarControl(undefined, undefined);
			isSubscribed = false;
		};
	}, []);

	const onSideMenuChange = useCallback((nextIsOpen: boolean) => {
		if (nextIsOpen !== isSidebarOpen) {
			setTimeout(() => {
				setIsSidebarOpen(nextIsOpen);
			}, 0);
		}
	}, [isSidebarOpen]);

	return (
		<SideMenu
			isOpen={isSidebarOpen}
			menu={<AppDrawer/>}
			onChange={onSideMenuChange}
		>
			<ModalStack.Navigator mode="modal" headerMode="none">
				<ModalStack.Screen name="Main" component={BottomTabNavigator}/>
				<ModalStack.Screen name="Player" component={PlayerScreen} options={{gestureEnabled: true}}/>
			</ModalStack.Navigator>
		</SideMenu>
	);

};
