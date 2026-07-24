import React from 'react';
import { StyleSheet } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Separator } from '../../../src/components/Separator';

describe('Separator', () => {
	it('renders a 1px line', async () => {
		const screen = await render(<Separator />);
		const style = StyleSheet.flatten(screen.root!.props.style) as { height?: number };
		expect(style.height).toBe(1);
	});

	it('uses the theme separator colour', async () => {
		const screen = await render(<Separator />);
		const style = StyleSheet.flatten(screen.root!.props.style) as { backgroundColor?: string };
		expect(style.backgroundColor).toBe('#a3a3a3');
	});
});
