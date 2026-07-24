import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import {
	AlbumListFavScreen,
	AlbumListRecentScreen,
	AlbumListFrequentScreen,
	AlbumListRandomScreen,
	AlbumListHighestScreen,
	AlbumListAvgHighestScreen
} from '../../src/screens/AlbumListScreen';
import { ListType, AlbumType } from '../../src/services/jam';
import { AlbumsTabNavigatorContext } from '../../src/navigators/AlbumsNavigatorContext';
import { AlbumList } from '../../src/components/AlbumList';
import { JamRouteLinks } from '../../src/navigators/Routes';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { screenProps } from '../../__mocks__/screen-props.ts';

interface AlbumListQuery {
	listType: ListType;
	albumType?: AlbumType;
	goLeft?: unknown;
	goRight?: unknown;
}

const lastQuery = (): AlbumListQuery | undefined => lastProps<{ query: AlbumListQuery }>(AlbumList)?.query;

jest.mock('../../src/components/AlbumList', () => require('../../__mocks__/components/AlbumList.tsx'));

describe('AlbumListScreen', () => {
	it('each variant builds its ListType (faved/recent/frequent/random/highest/avghighest)', async () => {
		const variants: Array<[React.ComponentType, ListType]> = [
			[AlbumListFavScreen as unknown as React.ComponentType, ListType.faved],
			[AlbumListRecentScreen as unknown as React.ComponentType, ListType.recent],
			[AlbumListFrequentScreen as unknown as React.ComponentType, ListType.frequent],
			[AlbumListRandomScreen as unknown as React.ComponentType, ListType.random],
			[AlbumListHighestScreen as unknown as React.ComponentType, ListType.highest],
			[AlbumListAvgHighestScreen as unknown as React.ComponentType, ListType.avghighest]
		];
		for (const [Screen, listType] of variants) {
			await render(<Screen />);
			expect(lastQuery()?.listType).toBe(listType);
		}
	});

	it('forwards the album type from the navigator context', async () => {
		await render(
			<AlbumsTabNavigatorContext.Provider value={{ albumType: AlbumType.compilation }}>
				<AlbumListFavScreen {...screenProps(AlbumListFavScreen)} />
			</AlbumsTabNavigatorContext.Provider>
		);
		expect(lastQuery()?.albumType).toBe(AlbumType.compilation);
	});

	it('sets the goLeft/goRight paging links', async () => {
		await render(<AlbumListRecentScreen {...screenProps(AlbumListRecentScreen)} />);
		expect(lastQuery()?.goLeft).toEqual(JamRouteLinks.albumlist(ListType.faved));
		expect(lastQuery()?.goRight).toEqual(JamRouteLinks.albumlist(ListType.frequent));

		await render(<AlbumListAvgHighestScreen {...screenProps(AlbumListAvgHighestScreen)} />);
		expect(lastQuery()?.goLeft).toEqual(JamRouteLinks.albumlist(ListType.highest));
		expect(lastQuery()?.goRight).toBeUndefined();
	});

	it('renders the AlbumList', async () => {
		await render(<AlbumListFavScreen {...screenProps(AlbumListFavScreen)} />);
		expect(AlbumList).toHaveBeenCalledTimes(1);
	});
});
