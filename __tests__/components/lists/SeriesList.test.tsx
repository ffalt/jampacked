import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { SeriesList } from '../../../src/components/SeriesList';
import { AlbumType, ListType } from '../../../src/services/jam';
import { useLazySeriesListQuery } from '../../../src/services/queries/seriesList';
import { BaseEntryListList, BaseEntryListListQuery } from '../../../src/components/BaseEntryListList';
import { lastProps } from '../../../__mocks__/mock-props.ts';

const mockLastQuery = (): BaseEntryListListQuery | undefined => lastProps<{ query: BaseEntryListListQuery }>(BaseEntryListList)?.query;

jest.mock('../../../src/components/BaseEntryListList', () => require('../../../__mocks__/components/BaseEntryListList.tsx'));

type QueryProps = React.ComponentProps<typeof SeriesList>['query'];

async function renderList(query: QueryProps = {}): ReturnType<typeof render> {
	return render(<SeriesList query={query} />);
}

describe('SeriesList', () => {
	it('uses the Series route link for the title and icon', async () => {
		await renderList();
		expect(mockLastQuery()?.text).toBe('Series');
		expect(mockLastQuery()?.icon).toBe('series');
	});

	it('forwards a provided album type', async () => {
		await renderList({ albumType: AlbumType.series });
		expect(mockLastQuery()?.albumTypes).toEqual([AlbumType.series]);
	});

	it('passes the list type and navigation links through', async () => {
		const goLeft = { navig: { route: 'Prev' } } as never;
		const goRight = { navig: { route: 'Next' } } as never;
		await renderList({ listType: ListType.recent, goLeft, goRight });
		expect(mockLastQuery()?.listType).toBe(ListType.recent);
		expect(mockLastQuery()?.goLeft).toBe(goLeft);
		expect(mockLastQuery()?.goRight).toBe(goRight);
	});

	it('wires the series list query hook', async () => {
		await renderList();
		expect(mockLastQuery()?.useList).toBe(useLazySeriesListQuery);
	});
});
