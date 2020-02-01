import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import LoadingScreen from '../screens/LoadingScreen';
import {AppStackNavigatorParamList, AuthContext, Routing} from './Routing';
import LoginScreen from '../screens/LoginScreen';
import jam from '../services/jamapi';
import {ModalNavigator} from './ModalNavigator';

const Stack = createStackNavigator<AppStackNavigatorParamList>();

export class AppNavigator extends React.PureComponent {
	state = {
		hasUser: false,
		isLoading: true
	};

	async componentDidMount(): Promise<void> {
		await jam.auth.load();
		try {
			await jam.auth.check();
			this.setState({hasUser: jam.auth.isLoggedIn(), isLoading: false});
		} catch (e) {
			this.setState({hasUser: false, isLoading: false});
		}
		SplashScreen.hide();
	}

	private loginHandler = async (server: string, name: string, password: string): Promise<void> => {
		await jam.auth.login(server, name, password);
		this.setState({hasUser: jam.auth.isLoggedIn()});
	};

	private logoutHandler = async (): Promise<void> => {
		try {
			await jam.auth.logout();
		} catch (e) {
			console.error(e);
		}
		this.setState({hasUser: false});
	};

	render(): JSX.Element {
		const value = {
			hasUser: this.state.hasUser,
			isLoading: this.state.isLoading,
			login: this.loginHandler,
			logout: this.logoutHandler
		};
		let screen: JSX.Element;
		if (this.state.isLoading) {
			screen = <Stack.Screen name={Routing.LOAD} component={LoadingScreen}/>;
		} else if (this.state.hasUser) {
			screen = <Stack.Screen name={Routing.APP} component={ModalNavigator}/>;
		} else {
			screen = <Stack.Screen name={Routing.AUTH} component={LoginScreen}/>;
		}
		return (
			<AuthContext.Provider value={value}>
				<Stack.Navigator headerMode="none">{screen}</Stack.Navigator>
			</AuthContext.Provider>
		);
	}
}
