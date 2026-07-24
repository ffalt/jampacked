import React from 'react';
import { StyleSheet } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { RadioButtons, RadioButtonEntry } from '../../../src/components/RadioButton';

const options: Array<RadioButtonEntry> = [{ key: 'light', label: 'Light' }, { key: 'dark', label: 'Dark' }, { key: 'black', label: 'Black' }];

function checkedCircleCount(screen: Awaited<ReturnType<typeof render>>): number {
	return screen.root!.queryAll(node => {
		if (node.type !== 'View') {
			return false;
		}
		const style = StyleSheet.flatten(node.props.style) as { width?: number };
		return style.width === 14;
	}).length;
}

describe('RadioButtons', () => {
	it('renders a row per option with its label', async () => {
		const screen = await render(<RadioButtons options={options} value="dark" onChange={jest.fn()} />);
		expect(screen.getByText('Light')).toBeTruthy();
		expect(screen.getByText('Dark')).toBeTruthy();
		expect(screen.getByText('Black')).toBeTruthy();
	});

	it('marks exactly the selected option with a checked circle', async () => {
		const screen = await render(<RadioButtons options={options} value="dark" onChange={jest.fn()} />);
		expect(checkedCircleCount(screen)).toBe(1);
	});

	it('renders no checked circle when the value matches nothing', async () => {
		const screen = await render(<RadioButtons options={options} value="unknown" onChange={jest.fn()} />);
		expect(checkedCircleCount(screen)).toBe(0);
	});

	it('calls onChange with the option key when a row is pressed', async () => {
		const onChange = jest.fn();
		const screen = await render(<RadioButtons options={options} value="dark" onChange={onChange} />);
		await fireEvent.press(screen.getByText('Light'));
		expect(onChange).toHaveBeenCalledWith('light');
	});
});
