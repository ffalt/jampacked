import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { ThemesView } from '../../../src/components/ThemesView';
import { themeList, useThemeContext } from '../../../src/style/theming';
import { RadioButtons } from '../../../src/components/RadioButton';
import { lastProps } from '../../../__mocks__/mock-props.ts';

interface RadioProps {
	options: Array<{ key: string; label: string }>;
	value?: string;
	onChange: (value: string) => void;
}

jest.mock('../../../src/components/RadioButton', () => require('../../../__mocks__/components/RadioButton.tsx'));

describe('ThemesView', () => {
	it('passes the theme list and the current theme to the radio buttons', async () => {
		await render(<ThemesView />);
		expect(lastProps<RadioProps>(RadioButtons)?.options).toEqual(themeList);
		expect(lastProps<RadioProps>(RadioButtons)?.value).toBe('light');
	});

	it('changes the theme when a different option is chosen', async () => {
		await render(<ThemesView />);
		lastProps<RadioProps>(RadioButtons)?.onChange('dark');
		expect(useThemeContext().setTheme).toHaveBeenCalledWith('dark');
	});
});
