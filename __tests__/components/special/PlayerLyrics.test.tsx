import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PlayerLyrics } from '../../../src/components/PlayerLyrics';
import { useTrackPlayerCurrentTrackID } from 'react-native-track-player';
import { Lyrics } from '../../../src/components/Lyrics';

const mockLyrics = jest.mocked(Lyrics);

jest.mock('../../../src/components/Lyrics', () => require('../../../__mocks__/components/Lyrics.tsx'));

let mockTrackID: string | undefined;

jest.mocked(useTrackPlayerCurrentTrackID).mockImplementation(() => mockTrackID);

describe('PlayerLyrics', () => {
	beforeEach(() => {
		mockTrackID = undefined;
	});

	it('passes the current track id to the lyrics view', async () => {
		mockTrackID = 'track-9';
		await render(<PlayerLyrics />);
		expect(mockLyrics.mock.calls[0][0].id).toBe('track-9');
	});

	it('passes an undefined id when there is no current track', async () => {
		mockTrackID = undefined;
		await render(<PlayerLyrics />);
		expect(mockLyrics.mock.calls[0][0].id).toBeUndefined();
	});
});
