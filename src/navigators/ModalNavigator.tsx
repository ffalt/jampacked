import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabNavigator} from './BottomTabNavigator';
import {PlayerScreen} from '../screens/PlayerScreen';
import {ModalRouting} from './Routing';
import {NavigationService} from './navigation';
import {Linking} from 'react-native';

const ModalStack = createStackNavigator();

export const ModalNavigator: React.FC = () => {
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


	return (
		<ModalStack.Navigator mode="modal" headerMode="none">
			<ModalStack.Screen name="Main" component={BottomTabNavigator}/>
			<ModalStack.Screen name="Player" component={PlayerScreen} options={{gestureEnabled: true}}/>
		</ModalStack.Navigator>
	);

};
