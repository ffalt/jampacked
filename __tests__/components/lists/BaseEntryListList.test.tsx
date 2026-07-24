import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, act } from '@testing-library/react-native';
import { BaseEntryListList, BaseEntryListListQuery } from '../../../src/components/BaseEntryListList';
import { BaseEntry, BaseEntryList as BaseEntryListData } from '../../../src/types/base';
import { JamObjectType, ListType } from '../../../src/services/jam';
import type { UseListCallFunction, useListFunction } from '../../../src/types/use-list';

jest.mock('../../../src/services/cache.service.ts', () => require('../../../__mocks__/services/cache.service.ts'));

import cacheService from '../../../src/services/cache.service';
import { BaseEntryList } from '../../../src/components/BaseEntryList';
import { ErrorView } from '../../../src/components/ErrorView';
import { lastProps } from '../../../__mocks__/mock-props.ts';

interface CapturedBaseEntryListProps {
	entries?: Array<BaseEntry>;
	refreshing: boolean;
	onRefresh: () => void;
	onLoadMore: () => void;
	info: { title: string; subtitle: string; icon: string };
	goLeft?: unknown;
	goRight?: unknown;
}

interface CapturedErrorViewProps {
	error: unknown;
	onRetry: () => void;
}

jest.mock('../../../src/components/BaseEntryList', () => require('../../../__mocks__/components/BaseEntryList.tsx'));

jest.mock('../../../src/components/ErrorView', () => require('../../../__mocks__/components/ErrorView.tsx'));

const mockGetList = jest.fn<void, Parameters<UseListCallFunction>>();

interface ListHookState {
	loading: boolean;
	error?: Error;
	data?: BaseEntryListData;
	called: boolean;
	queryID?: string;
}

let hookState: ListHookState;

const useList: useListFunction = () => [mockGetList, hookState];

function makeEntry(id: string, title: string): BaseEntry {
	return { id, title, desc: `desc ${id}`, objType: JamObjectType.album };
}

function makePage(count: number): Array<BaseEntry> {
	return Array.from({ length: count }, (_, index) => makeEntry(String(index), `Title ${index}`));
}

function makeQuery(overrides: Partial<BaseEntryListListQuery> = {}): BaseEntryListListQuery {
	return {
		icon: 'album',
		text: 'Top Albums',
		listType: ListType.highest,
		useList,
		...overrides
	};
}

describe('BaseEntryListList', () => {
	beforeEach(() => {
		hookState = { loading: false, called: false };
	});

	describe('info header', () => {
		it('builds the info from icon, text and explicit subtitle', async () => {
			await render(<BaseEntryListList query={makeQuery({ subtitle: 'Custom subtitle' })} />);
			expect(lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.info).toEqual({ icon: 'album', title: 'Top Albums', subtitle: 'Custom subtitle' });
		});

		it('falls back to the list-type name as the subtitle', async () => {
			await render(<BaseEntryListList query={makeQuery({ listType: ListType.recent })} />);
			expect(lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.info.subtitle).toBe('Recently Played');
		});
	});

	describe('data fetching', () => {
		it('fetches the list on mount when a list type is set', async () => {
			await render(<BaseEntryListList query={makeQuery({ listType: ListType.highest })} />);
			expect(mockGetList).toHaveBeenCalledTimes(1);
			expect(mockGetList).toHaveBeenCalledWith([], ListType.highest, [], undefined, 20, 0);
		});

		it('fetches the list on mount when genre ids are set', async () => {
			await render(<BaseEntryListList query={makeQuery({ listType: undefined, genreIDs: ['g1', 'g2'] })} />);
			expect(mockGetList).toHaveBeenCalledTimes(1);
			expect(mockGetList).toHaveBeenCalledWith([], undefined, ['g1', 'g2'], undefined, 20, 0);
		});

		it('does not fetch when neither a list type nor genre ids are set', async () => {
			await render(<BaseEntryListList query={makeQuery({ listType: undefined })} />);
			expect(mockGetList).not.toHaveBeenCalled();
		});
	});

	describe('entries', () => {
		it('starts with undefined entries before any data arrives', async () => {
			await render(<BaseEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.entries).toBeUndefined();
		});

		it('passes fetched items through to the list', async () => {
			const screen = await render(<BaseEntryListList query={makeQuery()} />);
			hookState = { loading: false, called: true, data: { items: [makeEntry('1', 'A'), makeEntry('2', 'B')], total: 2 } };
			await screen.rerender(<BaseEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.entries).toHaveLength(2);
		});

		it('appends further pages onto the existing entries', async () => {
			const screen = await render(<BaseEntryListList query={makeQuery()} />);
			hookState = { loading: false, called: true, data: { items: [makeEntry('1', 'A')], total: 3 } };
			await screen.rerender(<BaseEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.entries).toHaveLength(1);

			hookState = { loading: false, called: true, data: { items: [makeEntry('2', 'B'), makeEntry('3', 'C')], total: 3 } };
			await screen.rerender(<BaseEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.entries).toHaveLength(3);
		});
	});

	describe('loading state', () => {
		it('passes the hook loading flag through as refreshing', async () => {
			hookState = { loading: true, called: true };
			await render(<BaseEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.refreshing).toBe(true);
		});
	});

	describe('error handling', () => {
		it('renders the error view and hides the list on error', async () => {
			hookState = { loading: false, called: true, error: new Error('boom') };
			await render(<BaseEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedErrorViewProps>(ErrorView)?.error).toBeInstanceOf(Error);
			expect(lastProps<CapturedBaseEntryListProps>(BaseEntryList)).toBeUndefined();
		});
	});

	describe('load more', () => {
		it('requests the next page offset when more entries are available', async () => {
			const screen = await render(<BaseEntryListList query={makeQuery()} />);
			hookState = { loading: false, called: true, data: { items: makePage(20), total: 50 } };
			await screen.rerender(<BaseEntryListList query={makeQuery()} />);
			mockGetList.mockClear();

			await act(async () => {
				lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.onLoadMore();
			});

			expect(mockGetList).toHaveBeenCalledWith([], ListType.highest, [], undefined, 20, 20);
		});

		it('does not request more while a fetch is in flight', async () => {
			const screen = await render(<BaseEntryListList query={makeQuery()} />);
			hookState = { loading: true, called: true, data: { items: makePage(20), total: 50 } };
			await screen.rerender(<BaseEntryListList query={makeQuery()} />);
			mockGetList.mockClear();

			await act(async () => {
				lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.onLoadMore();
			});

			expect(mockGetList).not.toHaveBeenCalled();
		});

		it('does not request more when all entries are already loaded', async () => {
			const screen = await render(<BaseEntryListList query={makeQuery()} />);
			hookState = { loading: false, called: true, data: { items: [makeEntry('1', 'A'), makeEntry('2', 'B')], total: 2 } };
			await screen.rerender(<BaseEntryListList query={makeQuery()} />);
			mockGetList.mockClear();

			await act(async () => {
				lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.onLoadMore();
			});

			expect(mockGetList).not.toHaveBeenCalled();
		});
	});

	describe('reload', () => {
		it('clears the cache key and refetches from the start', async () => {
			const screen = await render(<BaseEntryListList query={makeQuery()} />);
			hookState = { loading: false, called: true, data: { items: [makeEntry('1', 'A')], total: 3 }, queryID: 'query-abc-skip-0' };
			await screen.rerender(<BaseEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.entries).toHaveLength(1);
			mockGetList.mockClear();

			await act(async () => {
				lastProps<CapturedBaseEntryListProps>(BaseEntryList)?.onRefresh();
			});

			expect(jest.mocked(cacheService.removeKeyStartWith)).toHaveBeenCalledWith('query-abc-');
		});
	});
});
