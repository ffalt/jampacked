import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { ArtistList } from '../../../src/components/ArtistList';
import { AlbumType, ListType } from '../../../src/services/jam';
import { useLazyArtistListQuery } from '../../../src/services/queries/artistList';
import { BaseEntryListList, BaseEntryListListQuery } from '../../../src/components/BaseEntryListList';
import { lastProps } from '../../../__mocks__/mock-props.ts';

const mockLastQuery = (): BaseEntryListListQuery | undefined => lastProps<{ query: BaseEntryListListQuery }>(BaseEntryListList)?.query;

jest.mock('../../../src/components/BaseEntryListList', () => require('../../../__mocks__/components/BaseEntryListList.tsx'));

type QueryProps = React.ComponentProps<typeof ArtistList>['query'];

async function renderList(query: QueryProps = {}): ReturnType<typeof render> {
	return render(<ArtistList query={query} />);
}

describe('ArtistList', () => {
	it('uses the Artists route link for the title and icon', async () => {
		await renderList();
		expect(mockLastQuery()?.text).toBe('Artists');
		expect(mockLastQuery()?.icon).toBe('artist');
	});

	it('has no album types when none is given', async () => {
		await renderList();
		expect(mockLastQuery()?.albumTypes).toEqual([]);
	});

	it('forwards a provided album type', async () => {
		await renderList({ albumType: AlbumType.live });
		expect(mockLastQuery()?.albumTypes).toEqual([AlbumType.live]);
	});

	it('passes the list type and navigation links through', async () => {
		const goLeft = { navig: { route: 'Prev' } } as never;
		const goRight = { navig: { route: 'Next' } } as never;
		await renderList({ listType: ListType.highest, goLeft, goRight });
		expect(mockLastQuery()?.listType).toBe(ListType.highest);
		expect(mockLastQuery()?.goLeft).toBe(goLeft);
		expect(mockLastQuery()?.goRight).toBe(goRight);
	});

	it('wires the artist list query hook', async () => {
		await renderList();
		expect(mockLastQuery()?.useList).toBe(useLazyArtistListQuery);
	});
});
