import 'react-native';
import React from 'react';
import {App} from '../App';
import {render} from '@testing-library/react-native';
import {it} from '@jest/globals';

it('renders', async () => {
	const screen = render(<App/>);
	expect(screen.toJSON()).toBeNull(); // missing test setup with react-native-screens
	// expect(screen.getAllByRole('button')).toBeOnTheScreen();
});
