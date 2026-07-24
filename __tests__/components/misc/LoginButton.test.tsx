import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { LoginButton } from '../../../src/components/LoginButton';

const testStyles = StyleSheet.create({
	button: { padding: 8 }
});

describe('LoginButton', () => {
	it('renders its children', async () => {
		const screen = await render(<LoginButton style={testStyles.button} onPress={jest.fn()}><Text>CHILD</Text></LoginButton>);
		expect(screen.getByText('CHILD')).toBeTruthy();
	});

	it('renders the label when there are no children', async () => {
		const screen = await render(<LoginButton style={testStyles.button} onPress={jest.fn()} label="Login" />);
		expect(screen.getByText('Login')).toBeTruthy();
	});

	it('calls onPress when pressed', async () => {
		const onPress = jest.fn();
		const screen = await render(<LoginButton style={testStyles.button} onPress={onPress} label="Login" />);
		await fireEvent.press(screen.getByText('Login'));
		expect(onPress).toHaveBeenCalledTimes(1);
	});
});
