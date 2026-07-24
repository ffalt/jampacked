import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PinnedMediaItem } from '../../../src/components/PinnedMediaItem';
import { PinMedia } from '../../../src/types/pin';
import { JamObjectType } from '../../../src/services/jam';
import { TrackEntry } from '../../../src/types/track';
import { JamImage } from '../../../src/components/JamImage';
import { PinIcon } from '../../../src/components/PinIcon';

const mockJamImage = jest.mocked(JamImage);
const mockPinIcon = jest.mocked(PinIcon);

jest.mock('../../../src/components/JamImage', () => require('../../../__mocks__/components/JamImage.tsx'));
jest.mock('../../../src/components/PinIcon', () => require('../../../__mocks__/components/PinIcon.tsx'));

function makeTrack(id: string): TrackEntry {
	return { id, duration: '3:00', durationMS: 180_000, trackNr: '1', title: `Track ${id}`, artist: 'Artist', album: 'Album' };
}

function makeMedia(overrides: Partial<PinMedia> = {}): PinMedia {
	return { id: 'p1', name: 'My Album', objType: JamObjectType.album, tracks: [makeTrack('1'), makeTrack('2')], ...overrides };
}

describe('PinnedMediaItem', () => {
	it('shows the media name', async () => {
		const screen = await render(<PinnedMediaItem item={makeMedia({ name: 'My Album' })} />);
		expect(screen.getByText('My Album')).toBeTruthy();
	});

	it('shows the title-cased object type', async () => {
		const screen = await render(<PinnedMediaItem item={makeMedia({ objType: JamObjectType.album })} />);
		expect(screen.getByText('Album')).toBeTruthy();
	});

	it('shows the track count', async () => {
		const screen = await render(<PinnedMediaItem item={makeMedia({ tracks: [makeTrack('1'), makeTrack('2'), makeTrack('3')] })} />);
		expect(screen.getByText(/Tracks:\s*3/)).toBeTruthy();
	});

	it('passes the media id to the image and pin control', async () => {
		await render(<PinnedMediaItem item={makeMedia({ id: 'p1' })} />);
		expect(mockJamImage.mock.calls[0][0].id).toBe('p1');
		expect(mockPinIcon.mock.calls[0][0].id).toBe('p1');
		expect(mockPinIcon.mock.calls[0][0].objType).toBe(JamObjectType.album);
	});
});
