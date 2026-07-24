import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { BaseEntryList, BaseEntryListInfo } from '../../../src/components/BaseEntryList';
import { Item } from '../../../src/components/Item';
import { BaseEntry } from '../../../src/types/base';
import { JamObjectType } from '../../../src/services/jam';
import { DefaultFlatList } from '../../../src/components/DefaultFlatList';
import { lastProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/components/Item', () => require('../../../__mocks__/components/Item.tsx'));
jest.mock('../../../src/components/ImageItem', () => require('../../../__mocks__/components/ImageItem.tsx'));
jest.mock('../../../src/components/PageHeader', () => require('../../../__mocks__/components/PageHeader.tsx'));

interface CapturedListProps {
	items?: Array<BaseEntry>;
	renderItem: (info: { item: BaseEntry }) => React.ReactElement<{ item: BaseEntry }>;
	ListHeaderComponent?: React.ReactElement<{ title: string; subtitle?: string; goLeft?: unknown; goRight?: unknown }>;
	onEndReached: () => void;
	reload: () => void;
	loading: boolean;
}

jest.mock('../../../src/components/DefaultFlatList.tsx', () => require('../../../__mocks__/components/DefaultFlatList.tsx'));

const info: BaseEntryListInfo = { title: 'Albums', subtitle: 'All albums', icon: 'album' };

function makeEntry(id: string, title: string): BaseEntry {
	return { id, title, desc: `desc ${id}`, objType: JamObjectType.album };
}

async function renderList(overrides: Partial<React.ComponentProps<typeof BaseEntryList>> = {}): ReturnType<typeof render> {
	const properties: React.ComponentProps<typeof BaseEntryList> = {
		info,
		entries: [makeEntry('1', 'First'), makeEntry('2', 'Second')],
		refreshing: false,
		onRefresh: jest.fn(),
		onLoadMore: jest.fn(),
		...overrides
	};
	return render(<BaseEntryList {...properties} />);
}

describe('BaseEntryList', () => {
	describe('rendering', () => {
		it('forwards each entry to the list and renders it through Item', async () => {
			const entries = [makeEntry('1', 'First'), makeEntry('2', 'Second')];
			await renderList({ entries });
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.items).toEqual(entries);
			const element = lastProps<CapturedListProps>(DefaultFlatList)!.renderItem({ item: entries[0] });
			expect(element.type).toBe(Item);
			expect(element.props.item).toBe(entries[0]);
		});

		it('builds the header from the info title and subtitle', async () => {
			await renderList();
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.ListHeaderComponent?.props.title).toBe('Albums');
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.ListHeaderComponent?.props.subtitle).toBe('All albums');
		});

		it('omits the navigation links on the header when goLeft/goRight are absent', async () => {
			await renderList();
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.ListHeaderComponent?.props.goLeft).toBeUndefined();
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.ListHeaderComponent?.props.goRight).toBeUndefined();
		});

		it('passes the navigation links to the header when goLeft/goRight are provided', async () => {
			const goLeft = { navig: { route: 'Prev' } } as never;
			const goRight = { navig: { route: 'Next' } } as never;
			await renderList({ goLeft, goRight });
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.ListHeaderComponent?.props.goLeft).toBe(goLeft);
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.ListHeaderComponent?.props.goRight).toBe(goRight);
		});

		it('forwards every entry of a large list', async () => {
			const entries = Array.from({ length: 500 }, (_, index) => makeEntry(String(index), `Title ${index}`));
			await renderList({ entries });
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.items).toHaveLength(500);
		});
	});

	describe('empty state', () => {
		it('forwards an empty entries array to the list', async () => {
			await renderList({ entries: [] });
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.items).toEqual([]);
		});

		it('forwards undefined entries to the list (loading placeholder)', async () => {
			await renderList({ entries: undefined });
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.items).toBeUndefined();
		});
	});

	describe('refresh control', () => {
		it('passes the refreshing prop through as the list loading state', async () => {
			await renderList({ refreshing: true });
			expect(lastProps<CapturedListProps>(DefaultFlatList)?.loading).toBe(true);
		});

		it('wires onRefresh to the list reload callback', async () => {
			const onRefresh = jest.fn();
			await renderList({ onRefresh });
			lastProps<CapturedListProps>(DefaultFlatList)?.reload();
			expect(onRefresh).toHaveBeenCalledTimes(1);
		});
	});

	describe('infinite scroll', () => {
		it('wires onLoadMore to the list onEndReached callback', async () => {
			const onLoadMore = jest.fn();
			await renderList({ onLoadMore });
			lastProps<CapturedListProps>(DefaultFlatList)?.onEndReached();
			expect(onLoadMore).toHaveBeenCalledTimes(1);
		});
	});
});
