import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {StatusBar} from 'react-native';
import {AppNavigator} from './src/navigators/AppNavigator';
import {ThemeContext, ThemeProvider, themes, ThemeSettings} from './src/style/theming';
import {setAppAvailable} from './service';
import {NavigationService} from './src/navigators/navigation';
import dataService from './src/services/data';
import {ApolloProvider} from '@apollo/react-hooks';
import {initApolloClient, JamApolloClient} from './src/services/apollo';

enableScreens();

export const App: React.FC = () => {
	const [client, setClient] = useState<JamApolloClient | undefined>();
	const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
		theme: themes.dark,
		loadUserTheme: async (): Promise<void> => {
			try {
				const theme = await dataService.getSetting('theme');
				if (theme && themes[theme]) {
					setThemeSettings({...themeSettings, theme: themes[theme]});
				}
			} catch (e) {
				console.error(e);
			}
		},
		setTheme: async (themeName): Promise<void> => {
			if (themes[themeName]) {
				setThemeSettings({...themeSettings, theme: themes[themeName]});
				try {
					await dataService.setSetting('theme', themeName);
				} catch (e) {
					console.error(e);
				}
			}
		}
	});

	useEffect(() => {
		initApolloClient().then(c => {
			setClient(c);
			setAppAvailable(true);
		});
		return (): void => {
			setAppAvailable(false);
		};
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
