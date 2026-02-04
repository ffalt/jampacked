import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigators/AppNavigator';
import { getAutoTheme, getTheme, ThemeContext, ThemeProvider, ThemeSettings } from './src/style/theming';
import { NavigationService } from './src/navigators/navigation';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient } from '@apollo/client';
import { sharedStyles } from './src/style/shared';
import { setAppAvailable } from './src/services/playback.service.ts';
import { ToastProvider } from 'react-native-toastier';
import apolloService from './src/services/apollo.service.ts';
import jamService from './src/services/jam.service.ts';
import storageService from './src/services/storage.service.ts';
import dbService from './src/services/db.service.ts';
import cacheService from './src/services/cache.service.ts';
import pinService from './src/services/pin.service.ts';
import queueStorageService from './src/services/queue-storage.service.ts';

enableScreens();

export const App: React.FC = () => {
	const [client, setClient] = useState<ApolloClient | undefined>();
	const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
		theme: getAutoTheme(),
		loadUserTheme: async (): Promise<void> => {
			try {
				const themeName = await storageService.getSetting('theme');
				const theme = getTheme(themeName);
				if (theme) {
					setThemeSettings({ ...themeSettings, theme });
				}
			} catch (error) {
				console.error(error);
			}
		},
		setTheme: async (themeName): Promise<void> => {
			const theme = getTheme(themeName);
			if (theme) {
				setThemeSettings({ ...themeSettings, theme });
				try {
					await storageService.setSetting('theme', themeName);
				} catch (error) {
					console.error(error);
				}
			}
		}
	});

	useEffect(() => {
		const init = async (): Promise<void> => {
			await dbService.init();
			await storageService.init();
			await jamService.auth.load();
			await apolloService.init();
			await cacheService.init();
			await pinService.init(jamService.currentUserToken);
			await themeSettings.loadUserTheme();
			await queueStorageService.load();
			if (apolloService.client) {
				setClient(apolloService.client);
			}
		};

		init()
			.then(() => setAppAvailable(true))
			.catch(console.error);
		return (): void => {
			setAppAvailable(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!client) {
		return <></>;
	}
	return (
		<GestureHandlerRootView style={sharedStyles.flex}>
			<ToastProvider>
				<ApolloProvider client={client}>
					<ThemeContext.Provider value={themeSettings}>
						<ThemeProvider theme={themeSettings.theme}>
							<StatusBar translucent={true} backgroundColor={themeSettings.theme.statusBar} barStyle={themeSettings.theme.barStyle} />
							<NavigationContainer theme={themeSettings.theme.navigation} ref={r => NavigationService.setTopLevelNavigator(r)}>
								<AppNavigator />
							</NavigationContainer>
						</ThemeProvider>
					</ThemeContext.Provider>
				</ApolloProvider>
			</ToastProvider>
		</GestureHandlerRootView>
	);
};
