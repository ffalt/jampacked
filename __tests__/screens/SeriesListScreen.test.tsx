import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import {
	SeriesListFavScreen,
	SeriesListRecentScreen,
	SeriesListFrequentScreen,
	SeriesListRandomScreen,
	SeriesListHighestScreen,
	SeriesListAvgHighestScreen
} from '../../src/screens/SeriesListScreen';
import { ListType } from '../../src/services/jam';
import { SeriesList } from '../../src/components/SeriesList';
import { JamRouteLinks } from '../../src/navigators/Routes';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { screenProps } from '../../__mocks__/screen-props.ts';

interface SeriesListQuery {
	listType: ListType;
	goLeft?: unknown;
	goRight?: unknown;
}

const lastQuery = (): SeriesListQuery | undefined => lastProps<{ query: SeriesListQuery }>(SeriesList)?.query;

jest.mock('../../src/components/SeriesList', () => require('../../__mocks__/components/SeriesList.tsx'));

describe('SeriesListScreen', () => {
	it('builds the query per variant', async () => {
		const variants: Array<[React.ComponentType, ListType]> = [
			[SeriesListFavScreen as unknown as React.ComponentType, ListType.faved],
			[SeriesListRecentScreen as unknown as React.ComponentType, ListType.recent],
			[SeriesListFrequentScreen as unknown as React.ComponentType, ListType.frequent],
			[SeriesListRandomScreen as unknown as React.ComponentType, ListType.random],
			[SeriesListHighestScreen as unknown as React.ComponentType, ListType.highest],
			[SeriesListAvgHighestScreen as unknown as React.ComponentType, ListType.avghighest]
		];
		for (const [Screen, listType] of variants) {
			await render(<Screen />);
			expect(lastQuery()?.listType).toBe(listType);
		}
		expect(lastQuery()?.goLeft).toEqual(JamRouteLinks.serieslist(ListType.highest));
		expect(lastQuery()?.goRight).toBeUndefined();
	});

	it('renders the SeriesList', async () => {
		await render(<SeriesListFavScreen {...screenProps(SeriesListFavScreen)} />);
		expect(SeriesList).toHaveBeenCalledTimes(1);
	});
});
