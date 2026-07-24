import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { AlbumScreen } from '../../src/screens/AlbumScreen';
import { HomeRoute } from '../../src/navigators/Routing';
import { AlbumTabNavigatorContext } from '../../src/navigators/AlbumNavigatorContext';
import { NavigationService } from '../../src/navigators/navigation';
import { ObjectHeader } from '../../src/components/ObjectHeader';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { useLazyAlbumQuery } from '../../src/services/queries/album';
import { Tracks } from '../../src/components/Tracks';
import { screenProps } from '../../__mocks__/screen-props.ts';

interface HeaderDetail {
	title: string;
	value: string;
	click?: () => void;
}

interface Album {
	artistName?: string;
	artistID?: string;
	trackCount?: number;
	genres?: Array<{ id: string; name: string }>;
	albumType?: string;
	tracks?: Array<{ id: string }>;
}

interface AlbumState {
	loading: boolean;
	error?: Error;
	album?: Album;
}

const mockGetAlbum = jest.fn();
let mockState: AlbumState;

jest.mock('../../src/services/queries/album');
jest.mocked(useLazyAlbumQuery).mockImplementation(() => [mockGetAlbum, mockState] as never);

jest.mock('../../src/navigators/navigation', () => require('../../__mocks__/navigators/navigation.ts'));
jest.mock('../../src/services/player.service.ts', () => require('../../__mocks__/services/player.service.ts'));

interface ObjectHeaderProps {
	id: string;
	title: string;
	typeName?: string;
	details?: Array<HeaderDetail>;
}

interface TracksProps {
	tracks?: Array<{ id: string }>;
	refreshing?: boolean;
	error?: Error;
	ListHeaderComponent?: React.ReactElement;
}

const mockTracks = jest.mocked(Tracks);
mockTracks.mockImplementation(((properties: TracksProps) => properties.ListHeaderComponent ?? null) as never);

jest.mock('../../src/components/ObjectHeader.tsx', () => require('../../__mocks__/components/ObjectHeader.tsx'));
jest.mock('../../src/components/Tracks', () => require('../../__mocks__/components/Tracks.tsx'));
jest.mock('../../src/components/FavIcon', () => require('../../__mocks__/components/FavIcon.tsx'));
jest.mock('../../src/components/PinIcon', () => require('../../__mocks__/components/PinIcon.tsx'));
jest.mock('../../src/components/ClickIcon', () => require('../../__mocks__/components/ClickIcon.tsx'));
jest.mock('../../src/components/Rating', () => require('../../__mocks__/components/Rating.tsx'));

const album: Album = {
	artistName: 'The Band',
	artistID: 'artist-1',
	trackCount: 10,
	genres: [{ id: 'genre-1', name: 'Rock' }],
	albumType: 'album',
	tracks: [{ id: 't1' }, { id: 't2' }]
};

async function renderScreen(id = 'album-1'): Promise<ReturnType<typeof render>> {
	return render(
		<AlbumTabNavigatorContext.Provider value={{ id, name: 'My Album' }}>
			<AlbumScreen {...screenProps(AlbumScreen)} />
		</AlbumTabNavigatorContext.Provider>
	);
}

describe('AlbumScreen', () => {
	beforeEach(() => {
		mockState = { loading: false, album };
	});

	it('fetches the album for the context id', async () => {
		await renderScreen('album-42');
		expect(mockGetAlbum).toHaveBeenCalledWith('album-42');
	});

	it('builds the header details (artist / tracks / genre)', async () => {
		await renderScreen();
		const details = lastProps<ObjectHeaderProps>(ObjectHeader)?.details ?? [];
		expect(details[0]).toEqual(expect.objectContaining({ title: 'Artist', value: 'The Band' }));
		expect(details[1]).toEqual(expect.objectContaining({ title: 'Tracks', value: '10' }));
		expect(details[2]).toEqual(expect.objectContaining({ title: 'Genre', value: 'Rock' }));
	});

	it('artist/genre detail taps navigate', async () => {
		await renderScreen();
		const details = lastProps<ObjectHeaderProps>(ObjectHeader)?.details ?? [];
		details[0].click?.();
		expect(jest.mocked(NavigationService.navigate)).toHaveBeenCalledWith(HomeRoute.ARTIST, { id: 'artist-1', name: 'The Band' });
		details[2].click?.();
		expect(jest.mocked(NavigationService.navigate)).toHaveBeenCalledWith(HomeRoute.GENRE, { id: 'genre-1', name: 'Rock' });
	});

	it('renders the album tracks', async () => {
		await renderScreen();
		expect(lastProps<TracksProps>(Tracks)?.tracks).toBe(album.tracks);
	});

	it('renders an ErrorView on error', async () => {
		const error = new Error('failed');
		mockState = { loading: false, error, album: undefined };
		await renderScreen();
		expect(lastProps<TracksProps>(Tracks)?.error).toBe(error);
	});
});
