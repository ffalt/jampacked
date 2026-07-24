import React from 'react';
import { Text } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { SwipeableItem } from '../../../src/components/SwipeableItem';

interface SharedValueLike {
	value: number;
}

interface SwipeableMethodsLike {
	close: () => void;
}

type RenderRightActions = (progress: SharedValueLike, translation: SharedValueLike, methods: SwipeableMethodsLike) => React.ReactElement;

function renderRightActionsOf(screen: Awaited<ReturnType<typeof render>>): RenderRightActions {
	return screen.root!.props.renderRightActions as RenderRightActions;
}

describe('SwipeableItem', () => {
	it('renders its children', async () => {
		const screen = await render(<SwipeableItem buttons={<Text>BUTTONS</Text>}><Text>CHILD</Text></SwipeableItem>);
		expect(screen.getByText('CHILD')).toBeTruthy();
	});

	it('renders the given buttons inside the right actions', async () => {
		const screen = await render(<SwipeableItem buttons={<Text>BUTTONS</Text>}><Text>CHILD</Text></SwipeableItem>);
		const rightActions = renderRightActionsOf(screen)({ value: 0 }, { value: 0 }, { close: jest.fn() });
		const actions = await render(rightActions);
		expect(actions.getByText('BUTTONS')).toBeTruthy();
	});

	it('closes the swipeable when the right-action area is pressed', async () => {
		const close = jest.fn();
		const screen = await render(<SwipeableItem buttons={<Text>BUTTONS</Text>}><Text>CHILD</Text></SwipeableItem>);
		const rightActions = renderRightActionsOf(screen)({ value: 0 }, { value: 0 }, { close });
		const actions = await render(rightActions);
		await fireEvent.press(actions.getByText('BUTTONS'));
		expect(close).toHaveBeenCalledTimes(1);
	});
});
