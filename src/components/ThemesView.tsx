import React from 'react';
import {ThemeContext, themeList} from '../style/theming';
import RadioButtons, {RadioButtonEntry} from './RadioButton';

export const themesList: Array<RadioButtonEntry> = themeList
	.map(theme => ({key: theme.name, label: theme.title}));

export class ThemesView extends React.PureComponent {
	static contextType = ThemeContext;
	state: { theme: string; } = {theme: 'dark'};

	componentDidMount(): void {
		const {theme} = this.context;
		this.setState({theme: theme.name});
	}

	private changeTheme = (theme: string): void => {
		const themeSettings = this.context;
		themeSettings.setTheme(theme);
		this.setState({theme});
	};

	render(): React.ReactElement {
		return (
			<RadioButtons options={themesList} value={this.state.theme} onChange={this.changeTheme}/>
		);
	}
}
