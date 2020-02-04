import React from 'react';
import {NavigationNativeContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {StatusBar} from 'react-native';
import {AppNavigator} from './src/navigators/AppNavigator';
import {ThemeContext, ThemeProvider, themes, ThemeSettings} from './src/style/theming';
import {setAppAvailable} from './service';
import NavigationService from './src/services/navigation';

enableScreens();

export default class App extends React.Component {
	static contextType = ThemeContext;
	state: ThemeSettings = {
		theme: themes.dark,
		// eslint-disable-next-line react/no-unused-state
		setTheme: (themeName) => {
			this.setState({
				theme: themes[themeName]
			});
		}
	};

	componentDidMount(): void {
		setAppAvailable(true);
	}

	componentWillUnmount(): void {
		setAppAvailable(false);
	}

	render(): React.ReactElement {
		return (
			<ThemeContext.Provider value={this.state}>
				<ThemeProvider theme={this.state.theme}>
					<StatusBar translucent={true} backgroundColor="rgba(0,0,0,0.5)" barStyle={this.state.theme.barStyle}/>
					<NavigationNativeContainer
						theme={this.state.theme.navigation}
						ref={NavigationService.setTopLevelNavigator}
					>
						<AppNavigator/>
					</NavigationNativeContainer>
				</ThemeProvider>
			</ThemeContext.Provider>
		);
	}
}
