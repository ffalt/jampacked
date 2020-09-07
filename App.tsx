import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {StatusBar} from 'react-native';
import {AppNavigator} from './src/navigators/AppNavigator';
import {ThemeContext, ThemeProvider, themes, ThemeSettings} from './src/style/theming';
import {setAppAvailable} from './service';
import {NavigationService} from './src/services/navigation';
import dataService from './src/services/data';
import {ApolloProvider} from '@apollo/react-hooks';
import {initApolloClient} from './src/services/apollo';
import {ApolloClient} from 'apollo-client';

enableScreens();

export default class App extends React.Component {
	static contextType = ThemeContext;
	state: ThemeSettings & { client?: ApolloClient<unknown> } = {
		theme: themes.dark,
		loadUserTheme: () => this.loadTheme(),
		setTheme: (themeName) => {
			if (themes[themeName]) {
				this.setState({
					theme: themes[themeName]
				});
				this.storeTheme(themeName);
			}
		}
	};

	async componentDidMount(): Promise<void> {
		const client = await initApolloClient();
		this.setState({client});
		setAppAvailable(true);
	}

	componentWillUnmount(): void {
		setAppAvailable(false);
	}

	render(): React.ReactElement {
		const {theme, client} = this.state;
		if (!client) {
			return <></>;
		}
		return (
			<ApolloProvider client={client}>
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
			</ApolloProvider>
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
