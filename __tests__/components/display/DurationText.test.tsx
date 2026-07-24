import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { DurationText } from '../../../src/components/DurationText';
import { render } from '@testing-library/react-native';

const styles = StyleSheet.create({
	custom: { opacity: 0.5 }
});

describe('DurationText', () => {
	describe('formatting', () => {
		it('should format a millisecond duration as MM:SS by default', async () => {
			const screen = await render(<DurationText duration={65_000} />);
			expect(screen.getByText('01:05')).toBeTruthy();
		});

		it('should format a second duration as MM:SS when ms is true', async () => {
			const screen = await render(<DurationText duration={65} ms />);
			expect(screen.getByText('01:05')).toBeTruthy();
		});

		it('should format an hour-scale duration as H:MM:SS', async () => {
			const screen = await render(<DurationText duration={3_665_000} />);
			expect(screen.getByText('1:01:05')).toBeTruthy();
		});

		it('should format a day-scale duration with a day prefix', async () => {
			const screen = await render(<DurationText duration={90_065_000} />);
			expect(screen.getByText('1d 01:01:05')).toBeTruthy();
		});
	});

	describe('edge cases', () => {
		it('should show 00:00 for a zero duration', async () => {
			const screen = await render(<DurationText duration={0} />);
			expect(screen.getByText('00:00')).toBeTruthy();
		});

		it('should show no text for an undefined duration', async () => {
			const screen = await render(<DurationText />);
			expect(screen.getByText('').props.children).toBe('');
		});

		it('should show 00:00 for an undefined duration when ms is true', async () => {
			const screen = await render(<DurationText ms />);
			expect(screen.getByText('00:00')).toBeTruthy();
		});
	});

	describe('props', () => {
		it('should update the displayed text when the duration prop changes', async () => {
			const screen = await render(<DurationText duration={5000} />);
			expect(screen.getByText('00:05')).toBeTruthy();

			await screen.rerender(<DurationText duration={10_000} />);
			expect(screen.getByText('00:10')).toBeTruthy();
		});

		it('should pass a custom style through to the underlying text', async () => {
			const screen = await render(<DurationText duration={0} style={styles.custom} />);
			const style = screen.getByText('00:00').props.style as Array<{ opacity?: number }>;
			expect(style.some(s => s?.opacity === 0.5)).toBe(true);
		});
	});
});
