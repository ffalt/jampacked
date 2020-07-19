import React from 'react';
import {themeList, useThemeContext} from '../style/theming';
import {RadioButtonEntry, RadioButtons} from './RadioButton';

export const themesList: Array<RadioButtonEntry> = themeList
	.map(theme => ({key: theme.name, label: theme.title}));

export const ThemesView: React.FC = () => {
	const themeSettings = useThemeContext();

	const changeTheme = (theme: string): void => {
		themeSettings.setTheme(theme);
	};

	return (
		<RadioButtons options={themesList} value={themeSettings.theme.name} onChange={changeTheme}/>
	);
};
