import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { FolderList } from '../../../src/components/FolderList';
import { AlbumType, ListType } from '../../../src/services/jam';
import { useLazyFolderListQuery } from '../../../src/services/queries/folderList';
import { BaseEntryListList, BaseEntryListListQuery } from '../../../src/components/BaseEntryListList';
import { lastProps } from '../../../__mocks__/mock-props.ts';

const mockLastQuery = (): BaseEntryListListQuery | undefined => lastProps<{ query: BaseEntryListListQuery }>(BaseEntryListList)?.query;

jest.mock('../../../src/components/BaseEntryListList', () => require('../../../__mocks__/components/BaseEntryListList.tsx'));

type QueryProps = React.ComponentProps<typeof FolderList>['query'];

async function renderList(query: QueryProps = {}): ReturnType<typeof render> {
	return render(<FolderList query={query} />);
}

describe('FolderList', () => {
	it('uses the Folders route link for the title and icon', async () => {
		await renderList();
		expect(mockLastQuery()?.text).toBe('Folders');
		expect(mockLastQuery()?.icon).toBe('folder');
	});

	it('forwards a provided album type', async () => {
		await renderList({ albumType: AlbumType.audiobook });
		expect(mockLastQuery()?.albumTypes).toEqual([AlbumType.audiobook]);
	});

	it('passes the list type and navigation links through', async () => {
		const goLeft = { navig: { route: 'Prev' } } as never;
		const goRight = { navig: { route: 'Next' } } as never;
		await renderList({ listType: ListType.frequent, goLeft, goRight });
		expect(mockLastQuery()?.listType).toBe(ListType.frequent);
		expect(mockLastQuery()?.goLeft).toBe(goLeft);
		expect(mockLastQuery()?.goRight).toBe(goRight);
	});

	it('wires the folder list query hook', async () => {
		await renderList();
		expect(mockLastQuery()?.useList).toBe(useLazyFolderListQuery);
	});
});
