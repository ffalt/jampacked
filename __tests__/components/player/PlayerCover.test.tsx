import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PlayerCover } from '../../../src/components/PlayerCover';
import { useTrackPlayerCurrentTrackID } from 'react-native-track-player';
import { JamImage } from '../../../src/components/JamImage';

const mockJamImage = jest.mocked(JamImage);

jest.mock('../../../src/components/JamImage', () => require('../../../__mocks__/components/JamImage.tsx'));

let mockTrackID: string | undefined;

jest.mocked(useTrackPlayerCurrentTrackID).mockImplementation(() => mockTrackID);

describe('PlayerCover', () => {
	beforeEach(() => {
		mockTrackID = undefined;
	});

	it('renders nothing when there is no current track', async () => {
		mockTrackID = undefined;
		const screen = await render(<PlayerCover />);
		expect(screen.toJSON()).toBeNull();
		expect(mockJamImage).not.toHaveBeenCalled();
	});

	it('renders the cover image for the current track', async () => {
		mockTrackID = 'track-42';
		await render(<PlayerCover />);
		expect(mockJamImage.mock.calls[0][0].id).toBe('track-42');
	});

	it('requests a large cover image', async () => {
		mockTrackID = 'track-42';
		await render(<PlayerCover />);
		expect(mockJamImage.mock.calls[0][0].requestSize).toBe(600);
	});
});
