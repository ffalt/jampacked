import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { ArtistScreen } from '../../src/screens/ArtistScreen';
import { ObjectHeader } from '../../src/components/ObjectHeader';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { useLazyArtistQuery } from '../../src/services/queries/artist';
import { DefaultSectionList } from '../../src/components/DefaultSectionList';
import { routeProps } from '../../__mocks__/screen-props.ts';

interface HeaderDetail {
	title: string;
	value: string;
	click?: () => void;
}

interface Artist {
	albumsCount?: number;
	tracksCount?: number;
	genres?: Array<{ id: string; name: string }>;
	sections?: Array<unknown>;
}

interface ArtistState {
	loading: boolean;
	error?: Error;
	artist?: Artist;
}

const mockGetArtist = jest.fn();
let mockState: ArtistState;

jest.mock('../../src/services/queries/artist');
jest.mocked(useLazyArtistQuery).mockImplementation(() => [mockGetArtist, mockState] as never);

jest.mock('../../src/navigators/navigation.ts', () => require('../../__mocks__/navigators/navigation.ts'));

interface ObjectHeaderProps {
	id: string;
	title: string;
	typeName?: string;
	details?: Array<HeaderDetail>;
}

interface SectionListProps {
	sections?: Array<unknown>;
	error?: Error;
	loading?: boolean;
	reload?: () => void;
	ListHeaderComponent?: React.ReactElement;
}

const mockSectionList = jest.mocked(DefaultSectionList);
mockSectionList.mockImplementation(((properties: SectionListProps) => properties.ListHeaderComponent ?? null) as never);

jest.mock('../../src/components/ObjectHeader.tsx', () => require('../../__mocks__/components/ObjectHeader.tsx'));
jest.mock('../../src/components/DefaultSectionList.tsx', () => require('../../__mocks__/components/DefaultSectionList.tsx'));
jest.mock('../../src/components/FavIcon', () => require('../../__mocks__/components/FavIcon.tsx'));
jest.mock('../../src/components/Rating', () => require('../../__mocks__/components/Rating.tsx'));
jest.mock('../../src/components/Item', () => require('../../__mocks__/components/Item.tsx'));
jest.mock('../../src/components/ThemedText', () => require('../../__mocks__/components/ThemedText.tsx'));

const artist: Artist = {
	albumsCount: 3,
	tracksCount: 20,
	genres: [{ id: 'genre-1', name: 'Rock' }],
	sections: [{ title: 'Albums', data: [] }]
};

async function renderScreen(id = 'artist-1', name = 'The Band'): Promise<ReturnType<typeof render>> {
	return render(<ArtistScreen {...routeProps(ArtistScreen, { id, name })} />);
}

describe('ArtistScreen', () => {
	beforeEach(() => {
		mockState = { loading: false, artist };
	});

	it('fetches the entity for the context id', async () => {
		await renderScreen('artist-42');
		expect(mockGetArtist).toHaveBeenCalledWith('artist-42');
	});

	it('renders the header / details', async () => {
		await renderScreen('artist-1', 'The Band');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.title).toBe('The Band');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.typeName).toBe('Artist');
		const details = lastProps<ObjectHeaderProps>(ObjectHeader)?.details ?? [];
		expect(details[0]).toEqual(expect.objectContaining({ title: 'Albums', value: '3' }));
		expect(details[1]).toEqual(expect.objectContaining({ title: 'Tracks', value: '20' }));
		expect(details[2]).toEqual(expect.objectContaining({ title: 'Genre', value: 'Rock' }));
	});

	it('renders the content list (and error/empty state)', async () => {
		await renderScreen();
		expect(lastProps<SectionListProps>(DefaultSectionList)?.sections).toBe(artist.sections);

		const error = new Error('failed');
		mockState = { loading: false, error, artist: undefined };
		await renderScreen();
		expect(lastProps<SectionListProps>(DefaultSectionList)?.error).toBe(error);
		expect(lastProps<SectionListProps>(DefaultSectionList)?.sections).toBeUndefined();
	});
});
