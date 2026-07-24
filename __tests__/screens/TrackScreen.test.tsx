import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { TrackScreen } from '../../src/screens/TrackScreen';
import { ObjectHeader } from '../../src/components/ObjectHeader';
import { ErrorView } from '../../src/components/ErrorView';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { useLazyTrackQuery } from '../../src/services/queries/track';
import { Lyrics } from '../../src/components/Lyrics';
import { routeProps } from '../../__mocks__/screen-props.ts';

interface HeaderDetail {
	title: string;
	value: string;
	click?: () => void;
}

interface Track {
	artist?: string;
	artistID?: string;
	album?: string;
	albumID?: string;
	genre?: string;
}

interface TrackState {
	loading: boolean;
	error?: Error;
	track?: Track;
}

const mockGetTrack = jest.fn();
let mockState: TrackState;

jest.mock('../../src/services/queries/track');
jest.mocked(useLazyTrackQuery).mockImplementation(() => [mockGetTrack, mockState] as never);

jest.mock('../../src/services/player.service.ts', () => require('../../__mocks__/services/player.service.ts'));
jest.mock('../../src/navigators/navigation', () => require('../../__mocks__/navigators/navigation.ts'));

interface ObjectHeaderProps {
	id: string;
	title: string;
	typeName?: string;
	details?: Array<HeaderDetail>;
}

interface ErrorViewProps {
	error: unknown;
	onRetry: () => void;
}

const mockLastLyricsId = (): string | undefined => lastProps<{ id: string }>(Lyrics)?.id;

jest.mock('../../src/components/ObjectHeader.tsx', () => require('../../__mocks__/components/ObjectHeader.tsx'));
jest.mock('../../src/components/Lyrics', () => require('../../__mocks__/components/Lyrics.tsx'));
jest.mock('../../src/components/ErrorView', () => require('../../__mocks__/components/ErrorView.tsx'));
jest.mock('../../src/components/FavIcon', () => require('../../__mocks__/components/FavIcon.tsx'));
jest.mock('../../src/components/ClickIcon', () => require('../../__mocks__/components/ClickIcon.tsx'));
jest.mock('../../src/components/Rating', () => require('../../__mocks__/components/Rating.tsx'));

const track: Track = { artist: 'The Band', artistID: 'artist-1', album: 'The Album', albumID: 'album-1', genre: 'Rock' };

async function renderScreen(id = 'track-1', name = 'My Track'): Promise<ReturnType<typeof render>> {
	return render(<TrackScreen {...routeProps(TrackScreen, { id, name })} />);
}

describe('TrackScreen', () => {
	beforeEach(() => {
		mockState = { loading: false, track };
	});

	it('fetches the entity for the context id', async () => {
		await renderScreen('track-42');
		expect(mockGetTrack).toHaveBeenCalledWith('track-42');
	});

	it('renders the header / details', async () => {
		await renderScreen('track-1', 'My Track');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.title).toBe('My Track');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.typeName).toBe('Track');
		const details = lastProps<ObjectHeaderProps>(ObjectHeader)?.details ?? [];
		expect(details[0]).toEqual(expect.objectContaining({ title: 'Artist', value: 'The Band' }));
		expect(details[1]).toEqual(expect.objectContaining({ title: 'Album', value: 'The Album' }));
		expect(details[2]).toEqual(expect.objectContaining({ title: 'Genre', value: 'Rock' }));
	});

	it('renders the content list (and error/empty state)', async () => {
		await renderScreen('track-7');
		expect(mockLastLyricsId()).toBe('track-7');

		const error = new Error('failed');
		mockState = { loading: false, error, track: undefined };
		jest.mocked(Lyrics).mockClear();
		await renderScreen();
		expect(lastProps<ErrorViewProps>(ErrorView)?.error).toBe(error);
		expect(Lyrics).not.toHaveBeenCalled();
	});
});
