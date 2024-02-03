import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {BottomTabNavigator} from './BottomTabNavigator';
import {PlayerScreen} from '../screens/PlayerScreen';
import {ModalRouting, ModalStackNavigatorParamList} from './Routing';
import {NavigationService} from './navigation';
import {Linking} from 'react-native';

const Stack = createStackNavigator<ModalStackNavigatorParamList>();

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

		const subscription = Linking.addEventListener('url', data => {
			if (isSubscribed) {
				handleUrl(data);
			}
		});

		return (): void => {
			isSubscribed = false;
			subscription.remove();
		};
	}, []);

	return (
		<Stack.Navigator screenOptions={{
			headerShown: false,
			gestureEnabled: true,
			gestureDirection: 'vertical',
			presentation: 'modal'
		}}>
			<Stack.Screen name={ModalRouting.MAIN} component={BottomTabNavigator}/>
			<Stack.Screen name={ModalRouting.PLAYER} component={PlayerScreen} options={{gestureEnabled: true}}/>
		</Stack.Navigator>
	);

};
