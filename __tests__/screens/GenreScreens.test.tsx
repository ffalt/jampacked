import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { GenreAlbumsScreen } from '../../src/screens/GenreAlbumsScreen';
import { GenreArtistsScreen } from '../../src/screens/GenreArtistsScreen';
import { GenreTracksScreen } from '../../src/screens/GenreTracksScreen';
import { GenreTabNavigatorContext } from '../../src/navigators/GenreNavigatorContext';
import { useLazyAlbumListQuery } from '../../src/services/queries/albumList';
import { useLazyArtistListQuery } from '../../src/services/queries/artistList';
import { useLazyTrackListQuery } from '../../src/services/queries/trackList';
import { BaseEntryListList } from '../../src/components/BaseEntryListList';
import { TrackEntryListList } from '../../src/components/TrackEntryListList';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { screenProps } from '../../__mocks__/screen-props.ts';

interface ListQuery {
	text: string;
	subtitle?: string;
	genreIDs: Array<string>;
	icon: string;
	useList: unknown;
}

jest.mock('../../src/components/BaseEntryListList', () => require('../../__mocks__/components/BaseEntryListList.tsx'));
jest.mock('../../src/components/TrackEntryListList', () => require('../../__mocks__/components/TrackEntryListList.tsx'));
jest.mock('../../src/services/queries/albumList');
jest.mock('../../src/services/queries/artistList');
jest.mock('../../src/services/queries/trackList');
jest.mock('../../src/navigators/Routes', () => require('../../__mocks__/navigators/Routes.ts'));

const baseQuery = (): ListQuery | undefined => lastProps<{ query: ListQuery }>(BaseEntryListList)?.query;
const trackQuery = (): ListQuery | undefined => lastProps<{ query: ListQuery }>(TrackEntryListList)?.query;

const genre = { id: 'g1', name: 'Rock' };

async function renderInGenre(node: React.ReactElement): Promise<ReturnType<typeof render>> {
	return render(<GenreTabNavigatorContext.Provider value={genre}>{node}</GenreTabNavigatorContext.Provider>);
}

describe('GenreScreens', () => {
	it('each reads the genre id from the genre navigator context', async () => {
		await renderInGenre(<GenreAlbumsScreen {...screenProps(GenreAlbumsScreen)} />);
		expect(baseQuery()?.genreIDs).toEqual(['g1']);

		await renderInGenre(<GenreArtistsScreen {...screenProps(GenreArtistsScreen)} />);
		expect(baseQuery()?.genreIDs).toEqual(['g1']);

		await renderInGenre(<GenreTracksScreen {...screenProps(GenreTracksScreen)} />);
		expect(trackQuery()?.genreIDs).toEqual(['g1']);
	});

	it('builds the query with the genre id', async () => {
		await renderInGenre(<GenreAlbumsScreen {...screenProps(GenreAlbumsScreen)} />);
		expect(baseQuery()).toEqual(expect.objectContaining({ text: 'Rock', subtitle: 'Albums in Genre', useList: useLazyAlbumListQuery }));

		await renderInGenre(<GenreArtistsScreen {...screenProps(GenreArtistsScreen)} />);
		expect(baseQuery()).toEqual(expect.objectContaining({ text: 'Rock', subtitle: 'Artists in Genre', useList: useLazyArtistListQuery }));

		await renderInGenre(<GenreTracksScreen {...screenProps(GenreTracksScreen)} />);
		expect(trackQuery()).toEqual(expect.objectContaining({ text: 'Rock', subtitle: 'Tracks in Genre', useList: useLazyTrackListQuery }));
	});

	it('renders the matching list', async () => {
		await renderInGenre(<GenreAlbumsScreen {...screenProps(GenreAlbumsScreen)} />);
		await renderInGenre(<GenreArtistsScreen {...screenProps(GenreArtistsScreen)} />);
		expect(BaseEntryListList).toHaveBeenCalledTimes(2);

		await renderInGenre(<GenreTracksScreen {...screenProps(GenreTracksScreen)} />);
		expect(TrackEntryListList).toHaveBeenCalledTimes(1);
	});
});
