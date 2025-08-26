import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'react-native';
import { AppNavigator } from './src/navigators/AppNavigator';
import { getAutoTheme, getTheme, ThemeContext, ThemeProvider, ThemeSettings } from './src/style/theming';
import { NavigationService } from './src/navigators/navigation';
import dataService from './src/services/data';
import { ApolloProvider } from '@apollo/client/react';
import { JamApolloClient } from './src/services/apollo';
import { sharedStyles } from './src/style/shared';
import { setAppAvailable } from './src/services/playback';
import { ToastProvider } from 'react-native-toastier';

enableScreens();

export const App: React.FC = () => {
	const [client, setClient] = useState<JamApolloClient | undefined>();
	const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
		theme: getAutoTheme(),
		loadUserTheme: async (): Promise<void> => {
			try {
				const themeName = await dataService.getSetting('theme');
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
					await dataService.setSetting('theme', themeName);
				} catch (error) {
					console.error(error);
				}
			}
		}
	});

	useEffect(() => {
		const init = async (): Promise<void> => {
			const c = await dataService.init();
			await themeSettings.loadUserTheme();
			setClient(c);
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
