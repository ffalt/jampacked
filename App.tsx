import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {StatusBar} from 'react-native';
import {AppNavigator} from './src/navigators/AppNavigator';
import {ThemeContext, ThemeProvider, themes, ThemeSettings} from './src/style/theming';
import {setAppAvailable} from './service';
import NavigationService from './src/services/navigation';
import dataService from './src/services/data';

enableScreens();

export default class App extends React.Component {
	static contextType = ThemeContext;
	state: ThemeSettings = {
		theme: themes.dark,
		// eslint-disable-next-line react/no-unused-state
		loadUserTheme: () => this.loadTheme(),
		// eslint-disable-next-line react/no-unused-state
		setTheme: (themeName) => {
			if (themes[themeName]) {
				this.setState({
					theme: themes[themeName]
				});
				this.storeTheme(themeName);
			}
		}
	};

	componentDidMount(): void {
		setAppAvailable(true);
	}

	componentWillUnmount(): void {
		setAppAvailable(false);
	}

	render(): React.ReactElement {
		const {theme} = this.state;
		return (
			<ThemeContext.Provider value={this.state}>
				<ThemeProvider theme={theme}>
					<StatusBar translucent={true} backgroundColor={theme.statusBar} barStyle={theme.barStyle}/>
					<NavigationContainer
						theme={theme.navigation}
						ref={NavigationService.setTopLevelNavigator}
					>
						<AppNavigator/>
					</NavigationContainer>
				</ThemeProvider>
			</ThemeContext.Provider>
		);
	}

	private async loadTheme(): Promise<void> {
		try {
			const theme = await dataService.getSetting('theme');
			if (theme && themes[theme]) {
				this.setState({theme: themes[theme]});
			}
		} catch (e) {
			console.error(e);
		}
	}

	private async storeTheme(themeName: string): Promise<void> {
		try {
			await dataService.setSetting('theme', themeName);
		} catch (e) {
			console.error(e);
		}
	}
}
