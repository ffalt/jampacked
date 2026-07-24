import React from 'react';
import { FlatList, Text } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render, act } from '@testing-library/react-native';
import { AtoZList } from '../../../src/components/AtoZList';
import { IndexEntry } from '../../../src/types/indexes';
import { JamObjectType } from '../../../src/services/jam';
import { AtoZPicker } from '../../../src/components/AtoZPicker';

interface PickerProps {
	letters: Array<string>;
	activeLetter?: string;
	onTouchLetter?: (letter: string) => void;
}

const mockAtoZPicker = jest.mocked(AtoZPicker);

jest.mock('../../../src/components/AtoZPicker', () => require('../../../__mocks__/components/AtoZPicker.tsx'));

function lastPickerProps(): PickerProps {
	const calls = mockAtoZPicker.mock.calls;
	return calls.at(-1)![0];
}

function makeEntry(id: string, letter: string): IndexEntry {
	return { id, title: `Title ${id}`, desc: `desc ${id}`, objType: JamObjectType.artist, letter };
}

function makeIndex(counts: Array<[string, number]>): Array<IndexEntry> {
	const entries: Array<IndexEntry> = [];
	let id = 0;
	for (const [letter, count] of counts) {
		for (let n = 0; n < count; n++) {
			entries.push(makeEntry(String(id++), letter));
		}
	}
	return entries;
}

const renderItem = ({ item }: { item: IndexEntry }): React.JSX.Element => (<Text testID={`row-${item.id}`}>{item.title}</Text>);

describe('AtoZList', () => {
	describe('data', () => {
		it('renders each data item through renderItem', async () => {
			const data = makeIndex([['A', 2]]);
			const screen = await render(<AtoZList data={data} renderItem={renderItem} itemHeight={50} testID="list" />);
			expect(screen.getByTestId('row-0')).toBeTruthy();
			expect(screen.getByTestId('row-1')).toBeTruthy();
		});
	});

	describe('picker letters', () => {
		it('shows no picker letters for 20 items or fewer', async () => {
			const data = makeIndex([['A', 10], ['B', 10]]);
			await render(<AtoZList data={data} renderItem={renderItem} itemHeight={50} testID="list" />);
			expect(lastPickerProps().letters).toEqual([]);
		});

		it('shows the deduped letters, in order, for more than 20 items', async () => {
			const data = makeIndex([['A', 11], ['B', 10]]);
			await render(<AtoZList data={data} renderItem={renderItem} itemHeight={50} testID="list" />);
			expect(lastPickerProps().letters).toEqual(['A', 'B']);
		});
	});

	describe('touch letter', () => {
		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('scrolls to the first item matching the touched letter', async () => {
			const scrollToIndexSpy = jest.spyOn(FlatList.prototype, 'scrollToIndex').mockReturnValue(undefined);
			const data = makeIndex([['A', 11], ['B', 10]]);
			await render(<AtoZList data={data} renderItem={renderItem} itemHeight={50} testID="list" />);
			lastPickerProps().onTouchLetter!('B');
			expect(scrollToIndexSpy).toHaveBeenCalledWith({ index: 11 });
		});

		it('ignores a touched letter that is not present in the data', async () => {
			const scrollToIndexSpy = jest.spyOn(FlatList.prototype, 'scrollToIndex').mockReturnValue(undefined);
			const data = makeIndex([['A', 11], ['B', 10]]);
			await render(<AtoZList data={data} renderItem={renderItem} itemHeight={50} testID="list" />);
			lastPickerProps().onTouchLetter!('Z');
			expect(scrollToIndexSpy).not.toHaveBeenCalled();
		});
	});

	describe('active letter on scroll', () => {
		it('updates the active letter based on the scroll offset and item height', async () => {
			const data = makeIndex([['A', 11], ['B', 10]]);
			const screen = await render(<AtoZList data={data} renderItem={renderItem} itemHeight={50} testID="list" />);
			expect(lastPickerProps().activeLetter).toBeUndefined();

			const scroller = screen.root!.queryAll(node => typeof node.props.onScroll === 'function')[0];
			const onScroll = scroller.props.onScroll as (event: unknown) => void;
			await act(async () => {
				onScroll({ nativeEvent: { contentOffset: { x: 0, y: 600 }, contentSize: { height: 1050, width: 100 }, layoutMeasurement: { height: 500, width: 100 } }, timeStamp: 0 });
			});

			expect(lastPickerProps().activeLetter).toBe('B');
		});
	});
});
