import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { Logo } from '../../../src/components/Logo';
import { render } from '@testing-library/react-native';

const styles = StyleSheet.create({
	custom: { opacity: 0.8 }
});

describe('Logo', () => {
	describe('rendering', () => {
		it('should render the logo image', async () => {
			const screen = await render(<Logo size={64} />);
			expect(screen.root?.props.source).toBeTruthy();
		});
	});

	describe('sizing', () => {
		it('should use the given size for both height and width (square aspect ratio)', async () => {
			const screen = await render(<Logo size={64} />);
			const style = StyleSheet.flatten(screen.root?.props.style) as { height?: number; width?: number };
			expect(style.height).toBe(64);
			expect(style.width).toBe(64);
		});

		it('should update its size when the size prop changes', async () => {
			const screen = await render(<Logo size={64} />);
			await screen.rerender(<Logo size={128} />);
			const style = StyleSheet.flatten(screen.root?.props.style) as { height?: number; width?: number };
			expect(style.height).toBe(128);
			expect(style.width).toBe(128);
		});
	});

	describe('styling', () => {
		it('should merge a custom style alongside the size styles', async () => {
			const screen = await render(<Logo size={64} style={styles.custom} />);
			const style = StyleSheet.flatten(screen.root?.props.style) as { opacity?: number; height?: number };
			expect(style.opacity).toBe(0.8);
			expect(style.height).toBe(64);
		});
	});
});
