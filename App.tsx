import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {LogBox, StatusBar} from 'react-native';
import {AppNavigator} from './src/navigators/AppNavigator';
import {getAutoTheme, getTheme, ThemeContext, ThemeProvider, ThemeSettings} from './src/style/theming';
import {setAppAvailable} from './service';
import {NavigationService} from './src/navigators/navigation';
import dataService from './src/services/data';
import {ApolloProvider} from '@apollo/client';
import {JamApolloClient} from './src/services/apollo';

LogBox.ignoreLogs([
	"[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
	'[GESTURE HANDLER] Gesture handler is already enabled for a parent view',
	'new NativeEventEmitter',
	'EventEmitter.removeListener'
]);
// LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
// LogBox.ignoreLogs(['EventEmitter.removeListener']); // Ignore log notification by message

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
					setThemeSettings({...themeSettings, theme});
				}
			} catch (e) {
				console.error(e);
			}
		},
		setTheme: async (themeName): Promise<void> => {
			const theme = getTheme(themeName);
			if (theme) {
				setThemeSettings({...themeSettings, theme});
				try {
					await dataService.setSetting('theme', themeName);
				} catch (e) {
					console.error(e);
				}
			}
		}
	});

	useEffect(() => {

		const init = async (): Promise<void> => {
			await dataService.jam.auth.load();
			await themeSettings.loadUserTheme();
			const c = await dataService.init();
			setClient(c);
		};

		init().then(() => {
			setAppAvailable(true);
		});
		return (): void => {
			setAppAvailable(false);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!client) {
		return <></>;
	}
	return (
		<ApolloProvider client={client}>
			<ThemeContext.Provider value={themeSettings}>
				<ThemeProvider theme={themeSettings.theme}>
					<StatusBar translucent={true} backgroundColor={themeSettings.theme.statusBar} barStyle={themeSettings.theme.barStyle}/>
					<NavigationContainer theme={themeSettings.theme.navigation} ref={NavigationService.setTopLevelNavigator}>
						<AppNavigator/>
					</NavigationContainer>
				</ThemeProvider>
			</ThemeContext.Provider>
		</ApolloProvider>
	);
};
