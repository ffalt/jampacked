import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { PlayerTrack } from '../../../src/components/PlayerTrack';
import { NavigationService } from '../../../src/navigators/navigation';
import { HomeRoute } from '../../../src/navigators/Routing';
import { TrackEntry } from '../../../src/types/track';
import { useTrackPlayerCurrentTrack } from 'react-native-track-player';
import { useLazyTrackQuery } from '../../../src/services/queries/track';

jest.mock('../../../src/navigators/navigation', () => require('../../../__mocks__/navigators/navigation.ts'));

const mockGetTrack = jest.fn();
let mockTrackResult: Partial<TrackEntry> | undefined;

jest.mock('../../../src/services/queries/track');
jest.mocked(useLazyTrackQuery).mockImplementation(() => [mockGetTrack, { track: mockTrackResult }] as never);

let mockCurrentTrack: { id: string; title: string; album: string; artist: string } | undefined;

jest.mocked(useTrackPlayerCurrentTrack).mockImplementation((() => mockCurrentTrack) as never);

describe('PlayerTrack', () => {
	beforeEach(() => {
		mockCurrentTrack = { id: 't1', title: 'Song', album: 'The Album', artist: 'The Artist' };
		mockTrackResult = { albumID: 'al1', artistID: 'ar1', album: 'The Album', artist: 'The Artist' };
	});

	it('fetches the full track for the current track id', async () => {
		await render(<PlayerTrack />);
		expect(mockGetTrack).toHaveBeenCalledWith('t1');
	});

	it('shows the current track title, album and artist', async () => {
		const screen = await render(<PlayerTrack />);
		expect(screen.getByText('Song')).toBeTruthy();
		expect(screen.getByText('The Album')).toBeTruthy();
		expect(screen.getByText('The Artist')).toBeTruthy();
	});

	it('navigates to the track when the title is tapped', async () => {
		const screen = await render(<PlayerTrack />);
		await fireEvent.press(screen.getByText('Song'));
		expect(jest.mocked(NavigationService.goBack)).toHaveBeenCalled();
		expect(jest.mocked(NavigationService.navigate)).toHaveBeenCalledWith(HomeRoute.TRACK, { id: 't1', name: 'Song' });
	});

	it('navigates to the album when the album is tapped', async () => {
		const screen = await render(<PlayerTrack />);
		await fireEvent.press(screen.getByText('The Album'));
		expect(jest.mocked(NavigationService.navigate)).toHaveBeenCalledWith(HomeRoute.ALBUM, { id: 'al1', name: 'The Album' });
	});

	it('navigates to the artist when the artist is tapped', async () => {
		const screen = await render(<PlayerTrack />);
		await fireEvent.press(screen.getByText('The Artist'));
		expect(jest.mocked(NavigationService.navigate)).toHaveBeenCalledWith(HomeRoute.ARTIST, { id: 'ar1', name: 'The Artist' });
	});
});
