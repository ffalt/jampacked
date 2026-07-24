import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { AtoZLetter } from '../../../src/components/AtoZLetter';
import { getTheme } from '../../../src/style/theming';

const theme = getTheme('light');

describe('AtoZLetter', () => {
	it('renders the given letter', async () => {
		const screen = await render(<AtoZLetter letter="A" active={false} />);
		expect(screen.getByText('A')).toBeTruthy();
	});

	it('uses the active colour when active', async () => {
		const screen = await render(<AtoZLetter letter="B" active={true} />);
		const style = StyleSheet.flatten(screen.getByText('B').props.style) as { color?: string };
		expect(style.color).toBe(theme.overlayTextActive);
	});

	it('uses the inactive colour when not active', async () => {
		const screen = await render(<AtoZLetter letter="C" active={false} />);
		const style = StyleSheet.flatten(screen.getByText('C').props.style) as { color?: string };
		expect(style.color).toBe(theme.overlayText);
	});
});
