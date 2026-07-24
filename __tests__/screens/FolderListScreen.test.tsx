import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import {
	FolderListFavScreen,
	FolderListRecentScreen,
	FolderListFrequentScreen,
	FolderListRandomScreen,
	FolderListHighestScreen,
	FolderListAvgHighestScreen
} from '../../src/screens/FolderListScreen';
import { ListType, AlbumType } from '../../src/services/jam';
import { FoldersTabNavigatorContext } from '../../src/navigators/FoldersNavigatorContext';
import { FolderList } from '../../src/components/FolderList';
import { JamRouteLinks } from '../../src/navigators/Routes';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { screenProps } from '../../__mocks__/screen-props.ts';

interface FolderListQuery {
	listType: ListType;
	albumType?: AlbumType;
	goLeft?: unknown;
	goRight?: unknown;
}

const lastQuery = (): FolderListQuery | undefined => lastProps<{ query: FolderListQuery }>(FolderList)?.query;

jest.mock('../../src/components/FolderList', () => require('../../__mocks__/components/FolderList.tsx'));

describe('FolderListScreen', () => {
	it('builds the query per variant', async () => {
		const variants: Array<[React.ComponentType, ListType]> = [
			[FolderListFavScreen as unknown as React.ComponentType, ListType.faved],
			[FolderListRecentScreen as unknown as React.ComponentType, ListType.recent],
			[FolderListFrequentScreen as unknown as React.ComponentType, ListType.frequent],
			[FolderListRandomScreen as unknown as React.ComponentType, ListType.random],
			[FolderListHighestScreen as unknown as React.ComponentType, ListType.highest],
			[FolderListAvgHighestScreen as unknown as React.ComponentType, ListType.avghighest]
		];
		for (const [Screen, listType] of variants) {
			await render(
				<FoldersTabNavigatorContext.Provider value={{ albumType: AlbumType.audiobook }}>
					<Screen />
				</FoldersTabNavigatorContext.Provider>
			);
			expect(lastQuery()?.listType).toBe(listType);
			expect(lastQuery()?.albumType).toBe(AlbumType.audiobook);
		}
		expect(lastQuery()?.goLeft).toEqual(JamRouteLinks.folderlist(ListType.highest, AlbumType.audiobook));
	});

	it('renders the FolderList', async () => {
		await render(<FolderListFavScreen {...screenProps(FolderListFavScreen)} />);
		expect(FolderList).toHaveBeenCalledTimes(1);
	});
});
