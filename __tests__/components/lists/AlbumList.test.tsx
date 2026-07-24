import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { AlbumList } from '../../../src/components/AlbumList';
import { AlbumType, ListType } from '../../../src/services/jam';
import { useLazyAlbumListQuery } from '../../../src/services/queries/albumList';
import { BaseEntryListList, BaseEntryListListQuery } from '../../../src/components/BaseEntryListList';
import { lastProps } from '../../../__mocks__/mock-props.ts';

const mockLastQuery = (): BaseEntryListListQuery | undefined => lastProps<{ query: BaseEntryListListQuery }>(BaseEntryListList)?.query;

jest.mock('../../../src/components/BaseEntryListList', () => require('../../../__mocks__/components/BaseEntryListList.tsx'));

type QueryProps = React.ComponentProps<typeof AlbumList>['query'];

async function renderList(query: QueryProps = {}): ReturnType<typeof render> {
	return render(<AlbumList query={query} />);
}

describe('AlbumList', () => {
	it('defaults to the generic Albums query when no album type is given', async () => {
		await renderList();
		expect(mockLastQuery()?.text).toBe('Albums');
		expect(mockLastQuery()?.icon).toBe('Album');
		expect(mockLastQuery()?.albumTypes).toEqual([]);
	});

	it('uses the album-type info for the title, icon and album types', async () => {
		await renderList({ albumType: AlbumType.compilation });
		expect(mockLastQuery()?.text).toBe('Compilations');
		expect(mockLastQuery()?.icon).toBe('compilation');
		expect(mockLastQuery()?.albumTypes).toEqual([AlbumType.compilation]);
	});

	it('passes the list type and navigation links through', async () => {
		const goLeft = { navig: { route: 'Prev' } } as never;
		const goRight = { navig: { route: 'Next' } } as never;
		await renderList({ listType: ListType.recent, goLeft, goRight });
		expect(mockLastQuery()?.listType).toBe(ListType.recent);
		expect(mockLastQuery()?.goLeft).toBe(goLeft);
		expect(mockLastQuery()?.goRight).toBe(goRight);
	});

	it('wires the album list query hook', async () => {
		await renderList();
		expect(mockLastQuery()?.useList).toBe(useLazyAlbumListQuery);
	});
});
