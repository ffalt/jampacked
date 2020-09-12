import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import {LoadingScreen} from '../screens/LoadingScreen';
import {AppStackNavigatorParamList, Routing} from './Routing';
import {LoginScreen} from '../screens/LoginScreen';
import dataService from '../services/data';
import {ThemeContext} from '../style/theming';
import {defaultAuth, AuthContext} from '../services/auth';
import {Jam} from '../services/jam';
import {DrawerNavigator} from './DrawerNavigation';

const Stack = createStackNavigator<AppStackNavigatorParamList>();

export class AppNavigator extends React.PureComponent {
	static contextType = ThemeContext;
	state: { hasUser: boolean; isLoading: boolean; user?: Jam.SessionUser } = {hasUser: false, isLoading: true, user: undefined};

	async componentDidMount(): Promise<void> {
		const themeSettings = this.context;
		await dataService.jam.auth.load();
		try {
			await dataService.jam.auth.check();
		} catch (e) {
			console.error(e);
		}
		this.setState({hasUser: dataService.jam.auth.isLoggedIn(), user: dataService.jam.auth.user, isLoading: false});
		try {
			await themeSettings.loadUserTheme();
		} catch (e) {
			console.error(e);
		}
		SplashScreen.hide();
	}

	private loginHandler = async (server: string, name: string, password: string): Promise<void> => {
		await dataService.jam.auth.login(server, name, password);
		this.setState({hasUser: dataService.jam.auth.isLoggedIn(), user: dataService.jam.auth.user});
	};

	private logoutHandler = async (): Promise<void> => {
		try {
			await dataService.jam.auth.logout();
		} catch (e) {
			console.error(e);
		}
		this.setState({hasUser: false, user: undefined});
	};

	render(): React.ReactElement {
		const {hasUser, isLoading, user} = this.state;
		const value = {
			...defaultAuth,
			hasUser,
			user,
			isLoading,
			login: this.loginHandler,
			logout: this.logoutHandler
		};
		let screen: JSX.Element;
		if (isLoading) {
			screen = <Stack.Screen name={Routing.LOAD} component={LoadingScreen}/>;
		} else if (hasUser) {
			screen = <Stack.Screen name={Routing.APP} component={DrawerNavigator}/>;
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
