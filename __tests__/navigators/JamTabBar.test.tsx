import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { JamTabBar, JamTabBarBackground, TAB_BAR_ROW_HEIGHT } from '../../src/navigators/JamTabBar';
import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { PlayerStrip } from '../../src/components/PlayerStrip';
import { mockTheme } from '../../__mocks__/style/theming.ts';

const mockPlayerStrip = jest.mocked(PlayerStrip);

jest.mock('../../src/components/PlayerStrip', () => require('../../__mocks__/components/PlayerStrip.tsx'));
jest.mock('@react-navigation/bottom-tabs');

const insets = { top: 24, left: 0, right: 0, bottom: 48 };

describe('JamTabBar', () => {
	it('renders the PlayerStrip above the tab bar', async () => {
		await render(<>{JamTabBar({ insets } as BottomTabBarProps)}</>);
		expect(mockPlayerStrip).toHaveBeenCalledTimes(1);
	});

	it('renders the underlying BottomTabBar with the given props', async () => {
		const props = { testProp: 'value', insets } as unknown as BottomTabBarProps;
		await render(<>{JamTabBar(props)}</>);
		expect(lastProps<BottomTabBarProps>(BottomTabBar)).toEqual({ ...props, style: { height: TAB_BAR_ROW_HEIGHT + insets.bottom } });
	});

	it('reserves the system navigation bar inset below the icon row', async () => {
		await render(<>{JamTabBar({ insets } as BottomTabBarProps)}</>);
		const style = StyleSheet.flatten(lastProps<{ style?: StyleProp<ViewStyle> }>(BottomTabBar)?.style);
		expect(style?.height).toBe(TAB_BAR_ROW_HEIGHT + insets.bottom);
	});
});

describe('JamTabBarBackground', () => {
	it('covers the icon row only, leaving the reserved inset unpainted', async () => {
		const screen = await render(<JamTabBarBackground />);
		const view = screen.toJSON() as unknown as { props: { style?: StyleProp<ViewStyle> } };
		const style = StyleSheet.flatten(view.props.style);
		expect(style?.height).toBe(TAB_BAR_ROW_HEIGHT);
		expect(style?.backgroundColor).toBe(mockTheme.navigation.colors.card);
	});
});
