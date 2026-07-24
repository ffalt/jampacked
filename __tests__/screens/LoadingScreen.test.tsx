import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { LoadingScreen } from '../../src/screens/LoadingScreen';
import { Logo } from '../../src/components/Logo';
import { screenProps } from '../../__mocks__/screen-props.ts';

const mockLogo = jest.mocked(Logo);

jest.mock('../../src/components/Logo', () => require('../../__mocks__/components/Logo.tsx'));

describe('LoadingScreen', () => {
	it('renders the Logo', async () => {
		await render(<LoadingScreen {...screenProps(LoadingScreen)} />);
		expect(mockLogo).toHaveBeenCalledTimes(1);
	});
});
