import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { ThemedCheckbox } from '../../../src/components/ThemedCheckbox';
import { render } from '@testing-library/react-native';
import { getTheme } from '../../../src/style/theming';

const theme = getTheme('light');

const styles = StyleSheet.create({
	custom: { margin: 5 }
});

describe('ThemedCheckbox', () => {
	describe('rendering', () => {
		it('should render as unchecked by default', async () => {
			const screen = await render(<ThemedCheckbox />);
			const accessibilityState = screen.getByRole('checkbox').props.accessibilityState as { checked?: boolean };
			expect(accessibilityState.checked).toBe(false);
		});

		it('should render as checked when isSelected is true', async () => {
			const screen = await render(<ThemedCheckbox isSelected />);
			const accessibilityState = screen.getByRole('checkbox').props.accessibilityState as { checked?: boolean };
			expect(accessibilityState.checked).toBe(true);
		});
	});

	describe('styling', () => {
		it('should use the theme colors for the checked and unchecked tint', async () => {
			const screen = await render(<ThemedCheckbox />);
			const checkbox = screen.root?.queryAll(node => node.type === 'RNCCheckbox')[0];
			expect(checkbox?.props.tintColors).toEqual({ true: theme.checkbox.checked, false: theme.checkbox.unchecked });
		});

		it('should merge a custom style onto the checkbox', async () => {
			const screen = await render(<ThemedCheckbox style={styles.custom} />);
			const checkbox = screen.root?.queryAll(node => node.type === 'RNCCheckbox')[0];
			const style = StyleSheet.flatten(checkbox?.props.style) as { margin?: number };
			expect(style.margin).toBe(5);
		});
	});
});
