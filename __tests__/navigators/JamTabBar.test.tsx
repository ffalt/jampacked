import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { JamTabBar } from '../../src/navigators/JamTabBar';
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { PlayerStrip } from '../../src/components/PlayerStrip';

const mockPlayerStrip = jest.mocked(PlayerStrip);

jest.mock('../../src/components/PlayerStrip', () => require('../../__mocks__/components/PlayerStrip.tsx'));
jest.mock('@react-navigation/bottom-tabs');

describe('JamTabBar', () => {
	it('renders the PlayerStrip above the tab bar', async () => {
		await render(<>{JamTabBar({} as BottomTabBarProps)}</>);
		expect(mockPlayerStrip).toHaveBeenCalledTimes(1);
	});

	it('renders the underlying BottomTabBar with the given props', async () => {
		const props = { testProp: 'value' } as unknown as BottomTabBarProps;
		await render(<>{JamTabBar(props)}</>);
		expect(lastProps<BottomTabBarProps>(BottomTabBar)).toEqual(props);
	});
});
