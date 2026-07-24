import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PlayerAnnotation } from '../../../src/components/PlayerAnnotation';
import { JamObjectType } from '../../../src/services/jam';
import { useTrackPlayerCurrentTrack } from 'react-native-track-player';
import { FavIcon } from '../../../src/components/FavIcon';
import { Rating } from '../../../src/components/Rating';

jest.mock('../../../src/components/ObjectHeader.tsx', () => require('../../../__mocks__/components/ObjectHeader.tsx'));

const mockFavIcon = jest.mocked(FavIcon);
const mockRating = jest.mocked(Rating);

jest.mock('../../../src/components/FavIcon', () => require('../../../__mocks__/components/FavIcon.tsx'));
jest.mock('../../../src/components/Rating', () => require('../../../__mocks__/components/Rating.tsx'));

let mockCurrentTrack: { id: string } | undefined;

jest.mocked(useTrackPlayerCurrentTrack).mockImplementation((() => mockCurrentTrack) as never);

describe('PlayerAnnotation', () => {
	beforeEach(() => {
		mockCurrentTrack = undefined;
	});

	it('passes the current track id to the favourite and rating controls', async () => {
		mockCurrentTrack = { id: 'track-1' };
		await render(<PlayerAnnotation />);
		expect(mockFavIcon.mock.calls[0][0].id).toBe('track-1');
		expect(mockRating.mock.calls[0][0].id).toBe('track-1');
	});

	it('uses the track object type for both controls', async () => {
		mockCurrentTrack = { id: 'track-1' };
		await render(<PlayerAnnotation />);
		expect(mockFavIcon.mock.calls[0][0].objType).toBe(JamObjectType.track);
		expect(mockRating.mock.calls[0][0].objType).toBe(JamObjectType.track);
	});

	it('passes an undefined id when there is no current track', async () => {
		mockCurrentTrack = undefined;
		await render(<PlayerAnnotation />);
		expect(mockFavIcon.mock.calls[0][0].id).toBeUndefined();
		expect(mockRating.mock.calls[0][0].id).toBeUndefined();
	});
});
