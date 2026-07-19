import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../../../src/components/ThemedText';
import { render } from '@testing-library/react-native';

jest.mock('../../../src/style/theming', () => ({
	useTheme: () => ({ textColor: '#111111' })
}));

const styles = StyleSheet.create({
	sized: { fontSize: 20 },
	overridden: { color: 'red' }
});

describe('ThemedText', () => {
	describe('rendering', () => {
		it('should render its children', async () => {
			const screen = await render(<ThemedText>Hello world</ThemedText>);
			expect(screen.getByText('Hello world')).toBeTruthy();
		});

		it('should render numeric and nested children', async () => {
			const screen = await render(
				<ThemedText>
					Count:
					{5}
				</ThemedText>
			);
			expect(screen.getByText(/Count:/)).toBeTruthy();
			expect(screen.getByText(/5/)).toBeTruthy();
		});
	});

	describe('styling', () => {
		it('should inherit the theme text color by default', async () => {
			const screen = await render(<ThemedText>Themed</ThemedText>);
			const style = StyleSheet.flatten(screen.getByText('Themed').props.style) as { color?: string };
			expect(style.color).toBe('#111111');
		});

		it('should apply a custom style in addition to the theme color', async () => {
			const screen = await render(<ThemedText style={styles.sized}>Sized</ThemedText>);
			const style = StyleSheet.flatten(screen.getByText('Sized').props.style) as { color?: string; fontSize?: number };
			expect(style.fontSize).toBe(20);
			expect(style.color).toBe('#111111');
		});

		it('should let a custom style override the theme color', async () => {
			const screen = await render(<ThemedText style={styles.overridden}>Overridden</ThemedText>);
			const style = StyleSheet.flatten(screen.getByText('Overridden').props.style) as { color?: string };
			expect(style.color).toBe('red');
		});
	});

	describe('props', () => {
		it('should pass numberOfLines through to the underlying Text', async () => {
			const screen = await render(<ThemedText numberOfLines={2}>Truncatable</ThemedText>);
			expect(screen.getByText('Truncatable').props.numberOfLines).toBe(2);
		});

		it('should leave numberOfLines undefined when not provided', async () => {
			const screen = await render(<ThemedText>Untruncated</ThemedText>);
			expect(screen.getByText('Untruncated').props.numberOfLines).toBeUndefined();
		});
	});
});
