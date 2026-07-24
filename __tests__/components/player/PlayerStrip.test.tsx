import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { PlayerStrip } from '../../../src/components/PlayerStrip';
import { JamPlayer } from '../../../src/services/player.service';
import { NavigationService } from '../../../src/navigators/navigation';
import { ModalRouting } from '../../../src/navigators/Routing';
import { useTrackPlayerCurrentTrack, useTrackPlayerHasSiblings } from 'react-native-track-player';
import { ClickIcon } from '../../../src/components/ClickIcon';
import { MiniProgressBar } from '../../../src/components/PlayerProgressMini';
import { ClickIconProps } from '../../helpers/test-types.ts';

jest.mock('../../../src/services/player.service.ts', () => require('../../../__mocks__/services/player.service.ts'));

jest.mock('../../../src/navigators/navigation', () => require('../../../__mocks__/navigators/navigation.ts'));
jest.mock('../../../src/components/JamImage', () => require('../../../__mocks__/components/JamImage.tsx'));
jest.mock('../../../src/components/PlayButton', () => require('../../../__mocks__/components/PlayButton.tsx'));

const mockMiniProgressBar = jest.mocked(MiniProgressBar);
jest.mock('../../../src/components/PlayerProgressMini', () => require('../../../__mocks__/components/PlayerProgressMini.tsx'));

const mockClickIcon = jest.mocked(ClickIcon);
jest.mock('../../../src/components/ClickIcon', () => require('../../../__mocks__/components/ClickIcon.tsx'));

let mockTrack: { id: string; title: string; artist: string } | undefined;
let mockSiblings: { hasNext: boolean; hasPrevious: boolean };

jest.mocked(useTrackPlayerCurrentTrack).mockImplementation((() => mockTrack) as never);
jest.mocked(useTrackPlayerHasSiblings).mockImplementation(() => mockSiblings);

function icon(name: string): ClickIconProps {
	return mockClickIcon.mock.calls.map(call => call[0]).find(properties => properties.iconName === name)!;
}

describe('PlayerStrip', () => {
	beforeEach(() => {
		mockTrack = { id: 't1', title: 'Song', artist: 'Artist' };
		mockSiblings = { hasNext: true, hasPrevious: true };
	});

	it('renders nothing when there is no current track', async () => {
		mockTrack = undefined;
		const screen = await render(<PlayerStrip />);
		expect(screen.toJSON()).toBeNull();
	});

	it('shows the current track title and artist', async () => {
		const screen = await render(<PlayerStrip />);
		expect(screen.getByText('Song')).toBeTruthy();
		expect(screen.getByText('Artist')).toBeTruthy();
	});

	it('opens the full player when the track is tapped', async () => {
		const screen = await render(<PlayerStrip />);
		await fireEvent.press(screen.getByText('Song'));
		expect(jest.mocked(NavigationService.navigate)).toHaveBeenCalledWith(ModalRouting.PLAYER);
	});

	it('skips to the previous/next track from the step controls', async () => {
		await render(<PlayerStrip />);
		icon('step-backward').onPress();
		icon('step-forward').onPress();
		expect(jest.mocked(JamPlayer.skipToPreviousSync)).toHaveBeenCalledTimes(1);
		expect(jest.mocked(JamPlayer.skipToNextSync)).toHaveBeenCalledTimes(1);
	});

	it('disables the step controls based on siblings', async () => {
		mockSiblings = { hasNext: false, hasPrevious: false };
		await render(<PlayerStrip />);
		expect(icon('step-backward').disabled).toBe(true);
		expect(icon('step-forward').disabled).toBe(true);
	});

	it('seeks backward and forward from the seek controls', async () => {
		await render(<PlayerStrip />);
		icon('backward').onPress();
		icon('forward').onPress();
		expect(jest.mocked(JamPlayer.skipBackwardSync)).toHaveBeenCalledTimes(1);
		expect(jest.mocked(JamPlayer.skipForwardSync)).toHaveBeenCalledTimes(1);
	});

	it('renders the mini progress bar', async () => {
		await render(<PlayerStrip />);
		expect(mockMiniProgressBar).toHaveBeenCalled();
	});
});
