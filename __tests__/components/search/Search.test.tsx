import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Search } from '../../../src/components/Search';
import { Item } from '../../../src/components/Item';
import { JamObjectType } from '../../../src/services/jam';
import { BaseEntry } from '../../../src/types/base';
import { SearchResultData } from '../../../src/types/search';
import { ClickLabelIcon } from '../../../src/components/ClickLabelIcon';
import { DefaultFlatList } from '../../../src/components/DefaultFlatList';
import { lastProps } from '../../../__mocks__/mock-props.ts';
import { useLazySearchQuery } from '../../../src/services/queries/search';

jest.mock('../../../src/components/Item', () => require('../../../__mocks__/components/Item.tsx'));

jest.mock('../../../src/services/queries/search');

const mockGetSearch = jest.fn();
let mockHookState: { loading: boolean; error?: Error; result?: SearchResultData; called: boolean };

jest.mocked(useLazySearchQuery).mockImplementation((() => [mockGetSearch, mockHookState]) as never);

interface LabelIconProps {
	label: string;
	iconName: string;
	onPress: () => void;
}

jest.mock('../../../src/components/ClickLabelIcon', () => require('../../../__mocks__/components/ClickLabelIcon.tsx'));

interface ListProps {
	items?: Array<BaseEntry>;
	renderItem: (info: { item: BaseEntry }) => React.ReactElement<{ item: BaseEntry }>;
	onEndReached?: () => void;
}

jest.mock('../../../src/components/DefaultFlatList.tsx', () => require('../../../__mocks__/components/DefaultFlatList.tsx'));

function makeEntry(id: string): BaseEntry {
	return { id, title: `Title ${id}`, desc: `desc ${id}`, objType: JamObjectType.artist };
}

function makeResult(count: number, total: number): SearchResultData {
	return { query: 'abba', total, entries: Array.from({ length: count }, (_, index) => makeEntry(String(index))) };
}

describe('Search', () => {
	beforeEach(() => {
		mockHookState = { loading: false, called: false };
	});

	it('fetches the first page when a query is given', async () => {
		await render(<Search objType={JamObjectType.artist} query="abba" />);
		expect(mockGetSearch).toHaveBeenCalledWith('abba', 20, 0);
	});

	it('does not fetch when there is no query', async () => {
		await render(<Search objType={JamObjectType.artist} />);
		expect(mockGetSearch).not.toHaveBeenCalled();
	});

	it('passes the result entries to the list', async () => {
		mockHookState = { loading: false, called: true, result: makeResult(2, 2) };
		await render(<Search objType={JamObjectType.artist} query="abba" />);
		expect(lastProps<ListProps>(DefaultFlatList)?.items).toHaveLength(2);
	});

	it('renders each entry through Item', async () => {
		mockHookState = { loading: false, called: true, result: makeResult(1, 1) };
		await render(<Search objType={JamObjectType.artist} query="abba" />);
		const element = lastProps<ListProps>(DefaultFlatList)!.renderItem({ item: makeEntry('0') });
		expect(element.type).toBe(Item);
	});

	it('labels the back button with the object type and calls backToAll', async () => {
		const backToAll = jest.fn();
		await render(<Search objType={JamObjectType.artist} query="abba" backToAll={backToAll} />);
		expect(lastProps<LabelIconProps>(ClickLabelIcon)?.label).toBe(JamObjectType.artist);
		lastProps<LabelIconProps>(ClickLabelIcon)?.onPress();
		expect(backToAll).toHaveBeenCalledTimes(1);
	});

	it('loads the next page when more entries are available', async () => {
		mockHookState = { loading: false, called: true, result: makeResult(20, 50) };
		await render(<Search objType={JamObjectType.artist} query="abba" />);
		mockGetSearch.mockClear();
		lastProps<ListProps>(DefaultFlatList)?.onEndReached?.();
		expect(mockGetSearch).toHaveBeenCalledWith('abba', 20, 20);
	});

	it('does not load more when all entries are already loaded', async () => {
		mockHookState = { loading: false, called: true, result: makeResult(2, 2) };
		await render(<Search objType={JamObjectType.artist} query="abba" />);
		mockGetSearch.mockClear();
		lastProps<ListProps>(DefaultFlatList)?.onEndReached?.();
		expect(mockGetSearch).not.toHaveBeenCalled();
	});
});
