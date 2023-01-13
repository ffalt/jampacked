import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoadingScreen} from '../screens/LoadingScreen';
import {AppStackNavigatorParamList, AppRouting} from './Routing';
import {LoginScreen} from '../screens/LoginScreen';
import dataService from '../services/data';
import {AuthContext, defaultAuth} from '../services/auth';
import RNBootSplash from 'react-native-bootsplash';
import {useThemeContext} from '../style/theming';
import {ModalNavigator} from './ModalNavigator';

const Stack = createNativeStackNavigator<AppStackNavigatorParamList>();

export const AppNavigator: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isChecking, setIsChecking] = useState<boolean>(true);
	const theme = useThemeContext();

	const [auth, setAuth] = useState({
		...defaultAuth,
		login: async (server: string, name: string, password: string): Promise<void> => {
			await dataService.jam.auth.login(server, name, password);
			await theme.loadUserTheme();
			setAuth(prev => ({...prev, hasUser: dataService.jam.auth.isLoggedIn(), user: dataService.jam.auth.user}));
		},
		logout: async (): Promise<void> => {
			try {
				await dataService.jam.auth.logout();
			} catch (e) {
				console.error(e);
			}
			setAuth(prev => ({...prev, hasUser: false, user: undefined}));
		}
	});

	useEffect(() => {
		let isSubscribed = true;
		const check = (): void => {
			dataService.jam.auth.check()
				.then(() => {
					if (isSubscribed) {
						setIsLoading(false);
						setAuth(prev => ({...prev, hasUser: dataService.jam.auth.isLoggedIn(), user: dataService.jam.auth.user}));
					}
					setIsChecking(false);
				})
				.catch(() => {
					if (isSubscribed) {
						setIsLoading(false);
					}
					setIsChecking(false);
				});
		};
		check();
		return (): void => {
			isSubscribed = false;
		};
	}, []);

	useEffect(() => {
		if (!isLoading) {
			RNBootSplash.hide({fade: true});
		}
	}, [isLoading]);

	let screen: JSX.Element;
	if (isLoading || isChecking) {
		screen = <Stack.Screen name={AppRouting.LOAD} component={LoadingScreen}/>;
	} else if (auth.hasUser) {
		screen = <Stack.Screen name={AppRouting.APP} component={ModalNavigator}/>;
	} else {
		screen = <Stack.Screen name={AppRouting.AUTH} component={LoginScreen}/>;
	}
	return (
		<AuthContext.Provider value={auth}>
			<Stack.Navigator screenOptions={{
				headerShown: false
			}}>{screen}</Stack.Navigator>
		</AuthContext.Provider>
	);
};
