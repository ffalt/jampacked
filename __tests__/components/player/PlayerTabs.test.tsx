import React from 'react';
import { StyleSheet } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import type { TestInstance } from 'test-renderer';
import { PlayerTabs } from '../../../src/components/PlayerTabs';
import { ClickIcon } from '../../../src/components/ClickIcon';

interface TabViewProps {
	navigationState: { index: number; routes: Array<{ key: string; title: string }> };
	renderTabBar: (props: { navigationState: { index: number; routes: Array<{ title: string }> } }) => React.ReactElement;
}

jest.mock('react-native-tab-view', () => ({
	SceneMap: (map: unknown) => map,
	TabView: (properties: TabViewProps): React.ReactElement => properties.renderTabBar({ navigationState: properties.navigationState })
}));

jest.mock('../../../src/components/PlayerCover', () => require('../../../__mocks__/components/PlayerCover.tsx'));
jest.mock('../../../src/components/PlayerLyrics', () => require('../../../__mocks__/components/PlayerLyrics.tsx'));
jest.mock('../../../src/components/Queue', () => require('../../../__mocks__/components/Queue.tsx'));

const mockClickIcon = jest.mocked(ClickIcon);

jest.mock('../../../src/components/ClickIcon', () => require('../../../__mocks__/components/ClickIcon.tsx'));

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
	...jest.requireActual('@react-navigation/native'),
	useNavigation: () => ({ goBack: mockGoBack })
}));

function tabButtons(screen: Awaited<ReturnType<typeof render>>): Array<TestInstance> {
	return screen.root!.queryAll(node => {
		if (node.type !== 'View') {
			return false;
		}
		const style = StyleSheet.flatten(node.props.style) as { paddingLeft?: number };
		return style.paddingLeft === 16;
	});
}

function isActive(button: TestInstance): boolean {
	return (StyleSheet.flatten(button.props.style) as { borderBottomWidth?: number }).borderBottomWidth === 1;
}

describe('PlayerTabs', () => {
	it('renders a tab for each route', async () => {
		const screen = await render(<PlayerTabs />);
		expect(screen.getByText('Cover')).toBeTruthy();
		expect(screen.getByText('Lyrics')).toBeTruthy();
		expect(screen.getByText('Queue')).toBeTruthy();
	});

	it('renders a close button', async () => {
		await render(<PlayerTabs />);
		const names = mockClickIcon.mock.calls.map(call => call[0].iconName);
		expect(names).toContain('down-open-big');
	});

	it('closes the player when the close button is pressed', async () => {
		await render(<PlayerTabs />);
		const close = mockClickIcon.mock.calls.map(call => call[0]).find(properties => properties.iconName === 'down-open-big')!;
		close.onPress();
		expect(mockGoBack).toHaveBeenCalledTimes(1);
	});

	it('highlights the first tab initially', async () => {
		const screen = await render(<PlayerTabs />);
		const buttons = tabButtons(screen);
		expect(buttons.map(button => isActive(button))).toEqual([true, false, false]);
	});

	it('highlights the tapped tab', async () => {
		const screen = await render(<PlayerTabs />);
		await fireEvent.press(tabButtons(screen)[1]);
		expect(tabButtons(screen).map(button => isActive(button))).toEqual([false, true, false]);
	});
});
