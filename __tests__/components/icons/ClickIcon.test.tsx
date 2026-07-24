import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { TestInstance } from 'test-renderer';
import { ClickIcon } from '../../../src/components/ClickIcon';
import { render, fireEvent } from '@testing-library/react-native';
import { getTheme } from '../../../src/style/theming';

const theme = getTheme('light');

const styles = StyleSheet.create({
	custom: { margin: 5 }
});

function iconStyle(root: TestInstance | null): { color?: string; fontSize?: number } {
	const icon = root?.queryAll(node => node.type === 'icon')[0];
	return StyleSheet.flatten(icon?.props.style) as { color?: string; fontSize?: number };
}

describe('ClickIcon', () => {
	describe('rendering', () => {
		it('should render the icon with the given name', async () => {
			const screen = await render(<ClickIcon iconName="play" onPress={jest.fn()} />);
			const icon = screen.root?.queryAll(node => node.type === 'icon')[0];
			expect(icon?.props.name).toBe('play');
		});
	});

	describe('interactions', () => {
		it('should call onPress when pressed', async () => {
			const onPress = jest.fn();
			const screen = await render(<ClickIcon iconName="play" onPress={onPress} />);

			await fireEvent.press(screen.root!);

			expect(onPress).toHaveBeenCalledTimes(1);
		});

		it('should call onPress once per press for repeated taps', async () => {
			const onPress = jest.fn();
			const screen = await render(<ClickIcon iconName="play" onPress={onPress} />);

			await fireEvent.press(screen.root!);
			await fireEvent.press(screen.root!);
			await fireEvent.press(screen.root!);

			expect(onPress).toHaveBeenCalledTimes(3);
		});

		it('should not call onPress when disabled', async () => {
			const onPress = jest.fn();
			const screen = await render(<ClickIcon iconName="play" onPress={onPress} disabled />);

			await fireEvent.press(screen.root!);

			expect(onPress).not.toHaveBeenCalled();
		});
	});

	describe('disabled state', () => {
		it('should mark the touchable as accessibility-disabled', async () => {
			const screen = await render(<ClickIcon iconName="play" onPress={jest.fn()} disabled />);
			const accessibilityState = screen.root?.props.accessibilityState as { disabled?: boolean };
			expect(accessibilityState.disabled).toBe(true);
		});
	});

	describe('styling', () => {
		it('should use the theme text color by default', async () => {
			const screen = await render(<ClickIcon iconName="play" onPress={jest.fn()} />);
			expect(iconStyle(screen.root).color).toBe(theme.textColor);
		});

		it('should use the theme muted color when muted is true', async () => {
			const screen = await render(<ClickIcon iconName="play" onPress={jest.fn()} muted />);
			expect(iconStyle(screen.root).color).toBe(theme.muted);
		});

		it('should let a custom color override muted', async () => {
			const screen = await render(<ClickIcon iconName="play" onPress={jest.fn()} muted color="red" />);
			expect(iconStyle(screen.root).color).toBe('red');
		});

		it('should map fontSize onto the icon', async () => {
			const screen = await render(<ClickIcon iconName="play" onPress={jest.fn()} fontSize={22} />);
			expect(iconStyle(screen.root).fontSize).toBe(22);
		});

		it('should apply a custom style to the touchable', async () => {
			const screen = await render(<ClickIcon iconName="play" onPress={jest.fn()} style={styles.custom} />);
			const style = StyleSheet.flatten(screen.root?.props.style) as { margin?: number };
			expect(style.margin).toBe(5);
		});
	});
});
