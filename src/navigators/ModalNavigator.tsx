import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContext} from '@react-navigation/native';
import {Linking} from 'react-native';
import {BottomTabNavigator} from './BottomTabNavigator';
import {PlayerScreen} from '../screens/PlayerScreen';
import {ModalRouting} from './Routing';

const ModalStack = createStackNavigator<any>();

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

	render(): React.ReactElement {
		return (
			<ModalStack.Navigator mode="modal" headerMode="none">
				<ModalStack.Screen name="Main" component={BottomTabNavigator} />
				<ModalStack.Screen name="Player" component={PlayerScreen} options={{gestureEnabled: true}} />
			</ModalStack.Navigator>
		);
	}
}
