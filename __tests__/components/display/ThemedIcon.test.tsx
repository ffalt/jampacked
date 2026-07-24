import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { ThemedIcon } from '../../../src/components/ThemedIcon';
import { render } from '@testing-library/react-native';
import { getTheme } from '../../../src/style/theming';

const theme = getTheme('light');

const styles = StyleSheet.create({
	custom: { fontSize: 40 }
});

describe('ThemedIcon', () => {
	describe('rendering', () => {
		it('should render the icon with the given name', async () => {
			const screen = await render(<ThemedIcon name="play" />);
			expect(screen.root).toBeTruthy();
			expect(screen.root?.props.name).toBe('play');
		});

		it('should render without crashing for an unknown icon name', async () => {
			const screen = await render(<ThemedIcon name="does-not-exist" />);
			expect(screen.root?.props.name).toBe('does-not-exist');
		});
	});

	describe('styling', () => {
		it('should use the theme text color by default', async () => {
			const screen = await render(<ThemedIcon name="play" />);
			const style = StyleSheet.flatten(screen.root?.props.style) as { color?: string };
			expect(style.color).toBe(theme.textColor);
		});

		it('should use a custom color over the theme color', async () => {
			const screen = await render(<ThemedIcon name="play" color="red" />);
			const style = StyleSheet.flatten(screen.root?.props.style) as { color?: string };
			expect(style.color).toBe('red');
		});

		it('should map the size prop to fontSize', async () => {
			const screen = await render(<ThemedIcon name="play" size={30} />);
			const style = StyleSheet.flatten(screen.root?.props.style) as { fontSize?: number };
			expect(style.fontSize).toBe(30);
		});

		it('should merge a custom style on top of the theme/size styles', async () => {
			const screen = await render(<ThemedIcon name="play" size={10} style={styles.custom} />);
			const style = StyleSheet.flatten(screen.root?.props.style) as { fontSize?: number };
			expect(style.fontSize).toBe(40);
		});
	});
});
