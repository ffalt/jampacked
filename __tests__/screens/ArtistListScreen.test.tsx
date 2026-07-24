import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import {
	ArtistListFavScreen,
	ArtistListRecentScreen,
	ArtistListFrequentScreen,
	ArtistListRandomScreen,
	ArtistListHighestScreen,
	ArtistListAvgHighestScreen
} from '../../src/screens/ArtistListScreen';
import { ListType } from '../../src/services/jam';
import { ArtistList } from '../../src/components/ArtistList';
import { JamRouteLinks } from '../../src/navigators/Routes';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { screenProps } from '../../__mocks__/screen-props.ts';

interface ArtistListQuery {
	listType: ListType;
	goLeft?: unknown;
	goRight?: unknown;
}

const lastQuery = (): ArtistListQuery | undefined => lastProps<{ query: ArtistListQuery }>(ArtistList)?.query;

jest.mock('../../src/components/ArtistList', () => require('../../__mocks__/components/ArtistList.tsx'));

describe('ArtistListScreen', () => {
	it('builds the ListType per variant', async () => {
		const variants: Array<[React.ComponentType, ListType]> = [
			[ArtistListFavScreen as unknown as React.ComponentType, ListType.faved],
			[ArtistListRecentScreen as unknown as React.ComponentType, ListType.recent],
			[ArtistListFrequentScreen as unknown as React.ComponentType, ListType.frequent],
			[ArtistListRandomScreen as unknown as React.ComponentType, ListType.random],
			[ArtistListHighestScreen as unknown as React.ComponentType, ListType.highest],
			[ArtistListAvgHighestScreen as unknown as React.ComponentType, ListType.avghighest]
		];
		for (const [Screen, listType] of variants) {
			await render(<Screen />);
			expect(lastQuery()?.listType).toBe(listType);
		}
	});

	it('sets the goLeft/goRight paging links', async () => {
		await render(<ArtistListFavScreen {...screenProps(ArtistListFavScreen)} />);
		expect(lastQuery()?.goLeft).toEqual(JamRouteLinks.artists());
		expect(lastQuery()?.goRight).toEqual(JamRouteLinks.artistlist(ListType.recent));

		await render(<ArtistListAvgHighestScreen {...screenProps(ArtistListAvgHighestScreen)} />);
		expect(lastQuery()?.goLeft).toEqual(JamRouteLinks.artistlist(ListType.highest));
		expect(lastQuery()?.goRight).toBeUndefined();
	});

	it('renders the ArtistList', async () => {
		await render(<ArtistListFavScreen {...screenProps(ArtistListFavScreen)} />);
		expect(ArtistList).toHaveBeenCalledTimes(1);
	});
});
