import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { TrackList } from '../../../src/components/TrackList';
import { ListType } from '../../../src/services/jam';
import { useLazyTrackListQuery } from '../../../src/services/queries/trackList';
import { TrackEntryListList, TrackEntryListListQuery } from '../../../src/components/TrackEntryListList';
import { lastProps } from '../../../__mocks__/mock-props.ts';

const mockLastQuery = (): TrackEntryListListQuery | undefined => lastProps<{ query: TrackEntryListListQuery }>(TrackEntryListList)?.query;

jest.mock('../../../src/components/TrackEntryListList', () => require('../../../__mocks__/components/TrackEntryListList.tsx'));

type QueryProps = React.ComponentProps<typeof TrackList>['query'];

async function renderList(query: QueryProps = {}): ReturnType<typeof render> {
	return render(<TrackList query={query} />);
}

describe('TrackList', () => {
	it('builds the generic Tracks title and icon', async () => {
		await renderList();
		expect(mockLastQuery()?.text).toBe('Tracks');
		expect(mockLastQuery()?.icon).toBe('Track');
	});

	it('passes the list type and navigation links through', async () => {
		const goLeft = { navig: { route: 'Prev' } } as never;
		const goRight = { navig: { route: 'Next' } } as never;
		await renderList({ listType: ListType.faved, goLeft, goRight });
		expect(mockLastQuery()?.listType).toBe(ListType.faved);
		expect(mockLastQuery()?.goLeft).toBe(goLeft);
		expect(mockLastQuery()?.goRight).toBe(goRight);
	});

	it('wires the track list query hook', async () => {
		await renderList();
		expect(mockLastQuery()?.useList).toBe(useLazyTrackListQuery);
	});
});
