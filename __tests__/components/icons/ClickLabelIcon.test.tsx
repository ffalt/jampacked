import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { ClickLabelIcon } from '../../../src/components/ClickLabelIcon';
import { render, fireEvent } from '@testing-library/react-native';
import { getTheme } from '../../../src/style/theming';

const theme = getTheme('light');

const styles = StyleSheet.create({
	label: { fontWeight: 'bold' }
});

describe('ClickLabelIcon', () => {
	describe('rendering', () => {
		it('should render the icon with the given name', async () => {
			const screen = await render(<ClickLabelIcon iconName="play" label="Play now" onPress={jest.fn()} />);
			const icon = screen.root?.queryAll(node => node.type === 'icon')[0];
			expect(icon?.props.name).toBe('play');
		});

		it('should render the label text', async () => {
			const screen = await render(<ClickLabelIcon iconName="play" label="Play now" onPress={jest.fn()} />);
			expect(screen.getByText('Play now')).toBeTruthy();
		});
	});

	describe('interactions', () => {
		it('should call onPress when pressed', async () => {
			const onPress = jest.fn();
			const screen = await render(<ClickLabelIcon iconName="play" label="Play now" onPress={onPress} />);

			await fireEvent.press(screen.root!);

			expect(onPress).toHaveBeenCalledTimes(1);
		});

		it('should not call onPress when disabled', async () => {
			const onPress = jest.fn();
			const screen = await render(<ClickLabelIcon iconName="play" label="Play now" onPress={onPress} disabled />);

			await fireEvent.press(screen.root!);

			expect(onPress).not.toHaveBeenCalled();
		});
	});

	describe('styling', () => {
		it('should use the theme muted color on the icon when muted is true', async () => {
			const screen = await render(<ClickLabelIcon iconName="play" label="Play now" onPress={jest.fn()} muted />);
			const icon = screen.root?.queryAll(node => node.type === 'icon')[0];
			const style = StyleSheet.flatten(icon?.props.style) as { color?: string };
			expect(style.color).toBe(theme.muted);
		});

		it('should apply a custom labelStyle to the label text', async () => {
			const screen = await render(
				<ClickLabelIcon iconName="play" label="Play now" onPress={jest.fn()} labelStyle={styles.label} />
			);
			const style = StyleSheet.flatten(screen.getByText('Play now').props.style) as { fontWeight?: string };
			expect(style.fontWeight).toBe('bold');
		});
	});
});
