import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PodcastScreen } from '../../src/screens/PodcastScreen';
import { ObjectHeader } from '../../src/components/ObjectHeader';
import { ErrorView } from '../../src/components/ErrorView';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { useLazyPodcastQuery } from '../../src/services/queries/podcast';
import { Tracks } from '../../src/components/Tracks';
import { routeProps } from '../../__mocks__/screen-props.ts';

interface Podcast {
	description?: string;
	episodes?: Array<{ id: string }>;
}

interface PodcastState {
	loading: boolean;
	error?: Error;
	podcast?: Podcast;
}

const mockGetPodcast = jest.fn();
let mockState: PodcastState;

jest.mock('../../src/services/queries/podcast');
jest.mocked(useLazyPodcastQuery).mockImplementation(() => [mockGetPodcast, mockState] as never);

jest.mock('../../src/services/player.service.ts', () => require('../../__mocks__/services/player.service.ts'));

interface ObjectHeaderProps {
	id: string;
	title: string;
	typeName?: string;
}

interface TracksProps {
	tracks?: Array<{ id: string }>;
	refreshing?: boolean;
	ListHeaderComponent?: React.ReactElement;
}

interface ErrorViewProps {
	error: unknown;
	onRetry: () => void;
}

const mockTracks = jest.mocked(Tracks);
mockTracks.mockImplementation(((properties: TracksProps) => properties.ListHeaderComponent ?? null) as never);

jest.mock('../../src/components/ObjectHeader.tsx', () => require('../../__mocks__/components/ObjectHeader.tsx'));
jest.mock('../../src/components/Tracks', () => require('../../__mocks__/components/Tracks.tsx'));
jest.mock('../../src/components/ErrorView', () => require('../../__mocks__/components/ErrorView.tsx'));
jest.mock('../../src/components/FavIcon', () => require('../../__mocks__/components/FavIcon.tsx'));
jest.mock('../../src/components/ClickIcon', () => require('../../__mocks__/components/ClickIcon.tsx'));
jest.mock('../../src/components/ThemedText', () => require('../../__mocks__/components/ThemedText.tsx'));

const podcast: Podcast = { description: 'a show', episodes: [{ id: 'e1' }, { id: 'e2' }] };

async function renderScreen(id = 'podcast-1', name = 'My Podcast'): Promise<ReturnType<typeof render>> {
	return render(<PodcastScreen {...routeProps(PodcastScreen, { id, name })} />);
}

describe('PodcastScreen', () => {
	beforeEach(() => {
		mockState = { loading: false, podcast };
	});

	it('fetches the entity for the context id', async () => {
		await renderScreen('podcast-42');
		expect(mockGetPodcast).toHaveBeenCalledWith('podcast-42');
	});

	it('renders the header / details', async () => {
		await renderScreen('podcast-1', 'My Podcast');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.title).toBe('My Podcast');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.typeName).toBe('Podcast');
	});

	it('renders the content list (and error/empty state)', async () => {
		await renderScreen();
		expect(lastProps<TracksProps>(Tracks)?.tracks).toBe(podcast.episodes);

		const error = new Error('failed');
		mockState = { loading: false, error, podcast: undefined };
		mockTracks.mockClear();
		await renderScreen();
		expect(lastProps<ErrorViewProps>(ErrorView)?.error).toBe(error);
		expect(mockTracks).not.toHaveBeenCalled();
	});
});
