import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PlayerControl } from '../../../src/components/PlayerControl';
import { JamPlayer } from '../../../src/services/player.service';
import { useTrackPlayerHasSiblings } from 'react-native-track-player';
import { ClickIcon } from '../../../src/components/ClickIcon';
import { ClickIconProps } from '../../helpers/test-types.ts';

jest.mock('../../../src/services/player.service.ts', () => require('../../../__mocks__/services/player.service.ts'));

jest.mock('../../../src/components/PlayButton', () => require('../../../__mocks__/components/PlayButton.tsx'));

const mockClickIcon = jest.mocked(ClickIcon);

jest.mock('../../../src/components/ClickIcon', () => require('../../../__mocks__/components/ClickIcon.tsx'));

let mockSiblings: { hasNext: boolean; hasPrevious: boolean } = { hasNext: true, hasPrevious: true };

jest.mocked(useTrackPlayerHasSiblings).mockImplementation(() => mockSiblings);

function iconByName(name: string): ClickIconProps {
	return mockClickIcon.mock.calls.map(call => call[0]).find(properties => properties.iconName === name)!;
}

describe('PlayerControl', () => {
	beforeEach(() => {
		mockSiblings = { hasNext: true, hasPrevious: true };
	});

	it('renders the four skip controls and the play button', async () => {
		await render(<PlayerControl />);
		const names = mockClickIcon.mock.calls.map(call => call[0].iconName);
		expect(names).toEqual(['step-backward', 'backward', 'forward', 'step-forward']);
	});

	it('skips to the previous track from the step-backward control', async () => {
		await render(<PlayerControl />);
		iconByName('step-backward').onPress();
		expect(jest.mocked(JamPlayer.skipToPreviousSync)).toHaveBeenCalledTimes(1);
	});

	it('skips to the next track from the step-forward control', async () => {
		await render(<PlayerControl />);
		iconByName('step-forward').onPress();
		expect(jest.mocked(JamPlayer.skipToNextSync)).toHaveBeenCalledTimes(1);
	});

	it('seeks backward and forward from the backward/forward controls', async () => {
		await render(<PlayerControl />);
		iconByName('backward').onPress();
		iconByName('forward').onPress();
		expect(jest.mocked(JamPlayer.skipBackwardSync)).toHaveBeenCalledTimes(1);
		expect(jest.mocked(JamPlayer.skipForwardSync)).toHaveBeenCalledTimes(1);
	});

	it('disables the step-backward control when there is no next track', async () => {
		mockSiblings = { hasNext: false, hasPrevious: true };
		await render(<PlayerControl />);
		expect(iconByName('step-backward').disabled).toBe(true);
		expect(iconByName('step-forward').disabled).toBe(false);
	});

	it('disables the step-forward control when there is no previous track', async () => {
		mockSiblings = { hasNext: true, hasPrevious: false };
		await render(<PlayerControl />);
		expect(iconByName('step-forward').disabled).toBe(true);
		expect(iconByName('step-backward').disabled).toBe(false);
	});
});
