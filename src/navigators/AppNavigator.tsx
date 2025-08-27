import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoadingScreen } from '../screens/LoadingScreen';
import { AppStackNavigatorParameterList, AppRouting } from './Routing';
import { LoginScreen } from '../screens/LoginScreen';
import { AuthContext, defaultAuth } from '../services/jam.auth.ts';
import RNBootSplash from 'react-native-bootsplash';
import { useThemeContext } from '../style/theming';
import { ModalNavigator } from './ModalNavigator';
import jamService from '../services/jam.service';

const Stack = createNativeStackNavigator<AppStackNavigatorParameterList>();

export const AppNavigator: React.FC = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isChecking, setIsChecking] = useState<boolean>(true);
	const theme = useThemeContext();

	const [auth, setAuth] = useState({
		...defaultAuth,
		login: async (server: string, name: string, password: string): Promise<void> => {
			await jamService.auth.login(server, name, password);
			await theme.loadUserTheme();
			setAuth(previous => ({ ...previous, hasUser: jamService.auth.isLoggedIn(), user: jamService.auth.user }));
		},
		logout: async (): Promise<void> => {
			try {
				await jamService.auth.logout();
			} catch (error) {
				console.error(error);
			}
			setAuth(previous => ({ ...previous, hasUser: false, user: undefined }));
		}
	});

	useEffect(() => {
		let isSubscribed = true;
		const check = (): void => {
			jamService.auth.check()
				.then(() => {
					if (isSubscribed) {
						setIsLoading(false);
						setAuth(previous => ({ ...previous, hasUser: jamService.auth.isLoggedIn(), user: jamService.auth.user }));
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
			RNBootSplash.hide({ fade: true })
				.catch(console.error);
		}
	}, [isLoading]);

	let screen: React.JSX.Element;
	if (isLoading || isChecking) {
		screen = <Stack.Screen name={AppRouting.LOAD} component={LoadingScreen} />;
	} else if (auth.hasUser) {
		screen = <Stack.Screen name={AppRouting.APP} component={ModalNavigator} />;
	} else {
		screen = <Stack.Screen name={AppRouting.AUTH} component={LoginScreen} />;
	}
	return (
		<AuthContext.Provider value={auth}>
			<Stack.Navigator screenOptions={{
				headerShown: false
			}}>
				{screen}
			</Stack.Navigator>
		</AuthContext.Provider>
	);
};
