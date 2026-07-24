import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { QueueItem } from '../../../src/components/QueueItem';
import { TrackPlayerTrack } from '../../../src/services/player.api';
import { JamPlayer } from '../../../src/services/player.service';
import { ClickIcon } from '../../../src/components/ClickIcon';
import { SwipeableItem } from '../../../src/components/SwipeableItem';
import { lastProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/services/player.service.ts', () => require('../../../__mocks__/services/player.service.ts'));

jest.mock('../../../src/components/PinIcon', () => require('../../../__mocks__/components/PinIcon.tsx'));
jest.mock('../../../src/components/FavIcon', () => require('../../../__mocks__/components/FavIcon.tsx'));

const mockClickIcon = jest.mocked(ClickIcon);

jest.mock('../../../src/components/ClickIcon', () => require('../../../__mocks__/components/ClickIcon.tsx'));

jest.mock('../../../src/components/SwipeableItem', () => require('../../../__mocks__/components/SwipeableItem.tsx'));

const mockSwipeButtons = (): React.ReactElement | undefined => lastProps<{ buttons: React.ReactElement }>(SwipeableItem)?.buttons;

function makeTrack(id: string): TrackPlayerTrack {
	return { id, url: `http://x/${id}`, title: `Title ${id}`, artist: `Artist ${id}`, duration: 185 };
}

describe('QueueItem', () => {
	it('shows the track title and artist', async () => {
		const screen = await render(<QueueItem item={makeTrack('1')} index={0} active={false} />);
		expect(screen.getByText('Title 1')).toBeTruthy();
		expect(screen.getByText('Artist 1')).toBeTruthy();
	});

	it('shows the 1-based track position when not active', async () => {
		const screen = await render(<QueueItem item={makeTrack('1')} index={4} active={false} />);
		expect(screen.getByText('5')).toBeTruthy();
	});

	it('hides the position number for the active track', async () => {
		const screen = await render(<QueueItem item={makeTrack('1')} index={4} active={true} />);
		expect(screen.queryByText('5')).toBeNull();
	});

	it('shows the track duration', async () => {
		const screen = await render(<QueueItem item={makeTrack('1')} index={0} active={false} />);
		expect(screen.getByText('03:05')).toBeTruthy();
	});

	it('skips to the track when the row is pressed', async () => {
		const screen = await render(<QueueItem item={makeTrack('1')} index={3} active={false} />);
		await fireEvent.press(screen.getByText('Title 1'));
		expect(jest.mocked(JamPlayer.skipToTrack)).toHaveBeenCalledWith(3);
	});

	it('removes the track from the queue when the remove action is pressed', async () => {
		await render(<QueueItem item={makeTrack('1')} index={3} active={false} />);
		await render(mockSwipeButtons()!);
		const remove = mockClickIcon.mock.calls.map(call => call[0]).find(properties => properties.iconName === 'remove')!;
		remove.onPress();
		expect(jest.mocked(JamPlayer.removeTrackFromQueue)).toHaveBeenCalledWith(3);
	});
});
