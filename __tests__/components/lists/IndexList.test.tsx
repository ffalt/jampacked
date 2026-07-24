import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { IndexList } from '../../../src/components/IndexList';
import { Item } from '../../../src/components/Item';
import { Index, IndexEntry } from '../../../src/types/indexes';
import { JamObjectType } from '../../../src/services/jam';
import { AtoZList } from '../../../src/components/AtoZList';
import { lastProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/components/Item', () => require('../../../__mocks__/components/Item.tsx'));
jest.mock('../../../src/components/ImageItem', () => require('../../../__mocks__/components/ImageItem.tsx'));
jest.mock('../../../src/components/PageHeader', () => require('../../../__mocks__/components/PageHeader.tsx'));

interface CapturedAtoZListProps {
	data?: Index;
	renderItem: (info: { item: IndexEntry }) => React.ReactElement<{ item: IndexEntry }>;
	ListHeaderComponent?: React.ReactElement<{ title: string; goLeft?: unknown; goRight?: unknown }>;
	ListEmptyComponent?: React.ReactElement<{ list?: Index }>;
	refreshControl?: React.ReactElement<{ refreshing: boolean; onRefresh: () => void }>;
	itemHeight?: number;
}

jest.mock('../../../src/components/AtoZList', () => require('../../../__mocks__/components/AtoZList.tsx'));

function makeEntry(id: string, title: string, letter: string): IndexEntry {
	return { id, title, desc: `desc ${id}`, objType: JamObjectType.artist, letter };
}

async function renderList(overrides: Partial<React.ComponentProps<typeof IndexList>> = {}): ReturnType<typeof render> {
	const properties: React.ComponentProps<typeof IndexList> = {
		title: 'Artists',
		index: [makeEntry('1', 'Abba', 'A'), makeEntry('2', 'Beatles', 'B')],
		refreshing: false,
		called: true,
		onRefresh: jest.fn(),
		...overrides
	};
	return render(<IndexList {...properties} />);
}

describe('IndexList', () => {
	it('forwards the index to the list as data', async () => {
		const index = [makeEntry('1', 'Abba', 'A'), makeEntry('2', 'Beatles', 'B')];
		await renderList({ index });
		expect(lastProps<CapturedAtoZListProps>(AtoZList)?.data).toEqual(index);
	});

	it('renders each entry through Item', async () => {
		const index = [makeEntry('1', 'Abba', 'A')];
		await renderList({ index });
		const element = lastProps<CapturedAtoZListProps>(AtoZList)!.renderItem({ item: index[0] });
		expect(element.type).toBe(Item);
		expect(element.props.item).toBe(index[0]);
	});

	it('builds the header from the title', async () => {
		await renderList({ title: 'Genres' });
		expect(lastProps<CapturedAtoZListProps>(AtoZList)?.ListHeaderComponent?.props.title).toBe('Genres');
	});

	it('omits the header navigation links when goLeft/goRight are absent', async () => {
		await renderList();
		expect(lastProps<CapturedAtoZListProps>(AtoZList)?.ListHeaderComponent?.props.goLeft).toBeUndefined();
		expect(lastProps<CapturedAtoZListProps>(AtoZList)?.ListHeaderComponent?.props.goRight).toBeUndefined();
	});

	it('passes the header navigation links when goLeft/goRight are provided', async () => {
		const goLeft = { navig: { route: 'Prev' } } as never;
		const goRight = { navig: { route: 'Next' } } as never;
		await renderList({ goLeft, goRight });
		expect(lastProps<CapturedAtoZListProps>(AtoZList)?.ListHeaderComponent?.props.goLeft).toBe(goLeft);
		expect(lastProps<CapturedAtoZListProps>(AtoZList)?.ListHeaderComponent?.props.goRight).toBe(goRight);
	});

	it('forwards the index to the empty component so it can show the right placeholder', async () => {
		await renderList({ index: undefined });
		expect(lastProps<CapturedAtoZListProps>(AtoZList)?.ListEmptyComponent?.props.list).toBeUndefined();
	});

	it('reflects the refreshing prop on the refresh control', async () => {
		await renderList({ refreshing: true });
		expect(lastProps<CapturedAtoZListProps>(AtoZList)?.refreshControl?.props.refreshing).toBe(true);
	});

	it('wires onRefresh onto the refresh control', async () => {
		const onRefresh = jest.fn();
		await renderList({ onRefresh });
		lastProps<CapturedAtoZListProps>(AtoZList)?.refreshControl?.props.onRefresh();
		expect(onRefresh).toHaveBeenCalledTimes(1);
	});
});
