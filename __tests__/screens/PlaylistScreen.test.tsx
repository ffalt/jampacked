import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PlaylistScreen } from '../../src/screens/PlaylistScreen';
import { ObjectHeader } from '../../src/components/ObjectHeader';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { useLazyPlaylistQuery } from '../../src/services/queries/playlist';
import { Tracks } from '../../src/components/Tracks';
import { routeProps } from '../../__mocks__/screen-props.ts';

interface Playlist {
	comment?: string;
	tracks?: Array<{ id: string }>;
}

interface PlaylistState {
	loading: boolean;
	error?: Error;
	playlist?: Playlist;
}

const mockGetPlaylist = jest.fn();
let mockState: PlaylistState;

jest.mock('../../src/services/queries/playlist');
jest.mocked(useLazyPlaylistQuery).mockImplementation(() => [mockGetPlaylist, mockState] as never);

jest.mock('../../src/services/player.service.ts', () => require('../../__mocks__/services/player.service.ts'));

interface ObjectHeaderProps {
	id: string;
	title: string;
	typeName?: string;
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
jest.mock('../../src/components/ClickIcon', () => require('../../__mocks__/components/ClickIcon.tsx'));
jest.mock('../../src/components/ThemedText', () => require('../../__mocks__/components/ThemedText.tsx'));

const playlist: Playlist = { comment: 'my mix', tracks: [{ id: 't1' }, { id: 't2' }] };

async function renderScreen(id = 'playlist-1', name = 'My Playlist'): Promise<ReturnType<typeof render>> {
	return render(<PlaylistScreen {...routeProps(PlaylistScreen, { id, name })} />);
}

describe('PlaylistScreen', () => {
	beforeEach(() => {
		mockState = { loading: false, playlist };
	});

	it('fetches the entity for the context id', async () => {
		await renderScreen('playlist-42');
		expect(mockGetPlaylist).toHaveBeenCalledWith('playlist-42');
	});

	it('renders the header / details', async () => {
		await renderScreen('playlist-1', 'My Playlist');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.title).toBe('My Playlist');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.typeName).toBe('Playlist');
	});

	it('renders the content list (and error/empty state)', async () => {
		await renderScreen();
		expect(lastProps<TracksProps>(Tracks)?.tracks).toBe(playlist.tracks);

		const error = new Error('failed');
		mockState = { loading: false, error, playlist: undefined };
		await renderScreen();
		expect(lastProps<TracksProps>(Tracks)?.error).toBe(error);
		expect(lastProps<TracksProps>(Tracks)?.tracks).toBeUndefined();
	});
});
