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
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	useEffect(() => {
		let isSubscribed = true;

		const handleUrl = (data?: { url: string | null }): void => {
			if (data?.url === 'trackplayer://notification.click') {
				NavigationService.navigate(ModalRouting.PLAYER);
				// const navigation = this.context;
				// navigation.navigate(ModalRouting.PLAYER);
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

	const closeMenu = (): void => {
		setIsMenuOpen(false);
	};

	const onSideMenuChange = useCallback(
		(nextIsOpen: boolean) => {
			if (nextIsOpen !== isMenuOpen) {
				setTimeout(() => {
					setIsMenuOpen(nextIsOpen);
				}, 10);
			}
		},
		[isMenuOpen]
	);

	return (
		<SideMenu
			isOpen={isMenuOpen}
			menu={<AppDrawer handleClose={closeMenu}/>}
			onChange={onSideMenuChange}
		>
			<ModalStack.Navigator mode="modal" headerMode="none">
				<ModalStack.Screen name="Main" component={BottomTabNavigator}/>
				<ModalStack.Screen name="Player" component={PlayerScreen} options={{gestureEnabled: true}}/>
			</ModalStack.Navigator>
		</SideMenu>
	);

};
/*
export class ModalNavigator extends React.PureComponent {
	static contextType = NavigationContext;

	componentDidMount(): void {
		Linking.getInitialURL().then((url) => this.handleUrl({url}));
		Linking.addEventListener('url', this.handleUrl.bind(this));
	}

	componentWillUnmount(): void {
		Linking.removeEventListener('url', this.handleUrl);
	}

	handleUrl(data: { url: string | null }): void {
		if (data.url === 'trackplayer://notification.click') {
			const navigation = this.context;
			navigation.navigate(ModalRouting.PLAYER);
		}
	}


	//


	render(): React.ReactElement {
		return (
			<SideMenu
				// isOpen={isMenuOpen}
				menu={<AppDrawer handleClose={() => {

				}}/>}
				// onChange={onSideMenuChange}
			>
				<ModalStack.Navigator mode="modal" headerMode="none">
					<ModalStack.Screen name="Main" component={BottomTabNavigator}/>
					<ModalStack.Screen name="Player" component={PlayerScreen} options={{gestureEnabled: true}}/>
				</ModalStack.Navigator>
			</SideMenu>
		);
	}
}
*/
