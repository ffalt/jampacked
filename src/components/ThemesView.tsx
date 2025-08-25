import React from 'react';
import { themeList, useThemeContext } from '../style/theming';
import { RadioButtons } from './RadioButton';

export const ThemesView: React.FC = () => {
	const themeSettings = useThemeContext();

	const changeTheme = (theme: string): void => {
		themeSettings.setTheme(theme).catch(console.error);
	};

	return (
		<RadioButtons options={themeList} value={themeSettings.theme.name} onChange={changeTheme} />
	);
};
