import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import {
	TrackListFavScreen,
	TrackListRecentScreen,
	TrackListFrequentScreen,
	TrackListRandomScreen,
	TrackListHighestScreen,
	TrackListAvgHighestScreen
} from '../../src/screens/TrackListScreen';
import { ListType } from '../../src/services/jam';
import { TrackList } from '../../src/components/TrackList';
import { JamRouteLinks } from '../../src/navigators/Routes';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { screenProps } from '../../__mocks__/screen-props.ts';

interface TrackListQuery {
	listType: ListType;
	goLeft?: unknown;
	goRight?: unknown;
}

const lastQuery = (): TrackListQuery | undefined => lastProps<{ query: TrackListQuery }>(TrackList)?.query;

jest.mock('../../src/components/TrackList', () => require('../../__mocks__/components/TrackList.tsx'));

describe('TrackListScreen', () => {
	it('builds the query per variant', async () => {
		const variants: Array<[React.ComponentType, ListType]> = [
			[TrackListFavScreen as unknown as React.ComponentType, ListType.faved],
			[TrackListRecentScreen as unknown as React.ComponentType, ListType.recent],
			[TrackListFrequentScreen as unknown as React.ComponentType, ListType.frequent],
			[TrackListRandomScreen as unknown as React.ComponentType, ListType.random],
			[TrackListHighestScreen as unknown as React.ComponentType, ListType.highest],
			[TrackListAvgHighestScreen as unknown as React.ComponentType, ListType.avghighest]
		];
		for (const [Screen, listType] of variants) {
			await render(<Screen />);
			expect(lastQuery()?.listType).toBe(listType);
		}
		expect(lastQuery()?.goLeft).toEqual(JamRouteLinks.tracklist(ListType.highest));
		expect(lastQuery()?.goRight).toBeUndefined();
	});

	it('renders the TrackList', async () => {
		await render(<TrackListFavScreen {...screenProps(TrackListFavScreen)} />);
		expect(TrackList).toHaveBeenCalledTimes(1);
	});
});
