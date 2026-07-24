import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { ListEmpty } from '../../../src/components/ListEmpty';
import { render } from '@testing-library/react-native';
import { getTheme } from '../../../src/style/theming';

const theme = getTheme('light');

describe('ListEmpty', () => {
	describe('rendering', () => {
		it('should display empty message when list is empty', async () => {
			const screen = await render(<ListEmpty list={[]} />);
			expect(screen.getByText('No entries')).toBeTruthy();
		});

		it('should show loading message when list is undefined', async () => {
			const screen = await render(<ListEmpty />);
			expect(screen.getByText('Loading')).toBeTruthy();
		});

		it('should render no message when the list has entries', async () => {
			const screen = await render(<ListEmpty list={[1, 2, 3]} />);
			expect(screen.queryByText('No entries')).toBeNull();
			expect(screen.queryByText('Loading')).toBeNull();
		});
	});

	describe('styling', () => {
		it('should use a centered layout', async () => {
			const screen = await render(<ListEmpty list={[]} />);
			const container = screen.getByText('No entries').parent;
			const style = StyleSheet.flatten(container?.props.style) as { alignItems?: string; justifyContent?: string };
			expect(style.alignItems).toBe('center');
			expect(style.justifyContent).toBe('center');
		});

		it('should apply the muted theme color to the text', async () => {
			const screen = await render(<ListEmpty list={[]} />);
			const style = StyleSheet.flatten(screen.getByText('No entries').props.style) as { color?: string };
			expect(style.color).toBe(theme.muted);
		});
	});
});
