import React from 'react';
import {StyleSheet, Switch, View} from 'react-native';
import {staticTheme, ThemeContext} from '../style/theming';
import ThemedText from './ThemedText';

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'row',
		padding: staticTheme.paddingSmall
	},
	text: {
		flex: 1
	}
});

export class ThemesView extends React.PureComponent {
	static contextType = ThemeContext;
	state: { dark: boolean } = {dark: true};

	componentDidMount(): void {
		const {theme} = this.context;
		this.setState({dark: theme.name === 'dark'});
	}

	private toggle = (dark: boolean): void => {
		const themeSettings = this.context;
		themeSettings.setTheme(dark ? 'dark' : 'light');
		this.setState({dark});
	};

	render(): JSX.Element {
		return (
			<View style={styles.container}>
				<ThemedText style={styles.text}>Dark Theme</ThemedText>
				<Switch value={this.state.dark} onValueChange={this.toggle}/>
			</View>
		);
	}
}
