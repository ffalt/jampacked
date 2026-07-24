import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, act } from '@testing-library/react-native';
import { TrackEntryListList, TrackEntryListListQuery } from '../../../src/components/TrackEntryListList';
import { defaultListTrackDisplay } from '../../../src/components/TrackItem';
import { TrackEntry, TrackEntryList as TrackEntryListData } from '../../../src/types/track';
import { ListType } from '../../../src/services/jam';
import type { UseTrackListCallFunction, useTrackListFunction } from '../../../src/types/use-track-list';

jest.mock('../../../src/services/cache.service.ts', () => require('../../../__mocks__/services/cache.service.ts'));

import cacheService from '../../../src/services/cache.service';
import { TrackEntryList } from '../../../src/components/TrackEntryList';
import { ErrorView } from '../../../src/components/ErrorView';
import { lastProps } from '../../../__mocks__/mock-props.ts';

interface CapturedTrackListProps {
	entries?: Array<TrackEntry>;
	refreshing: boolean;
	onRefresh: () => void;
	onLoadMore: () => void;
	info: { title: string; subtitle: string; icon: string };
	displayFunc?: unknown;
}

interface CapturedErrorProps {
	error: unknown;
	onRetry: () => void;
}

jest.mock('../../../src/components/TrackEntryList', () => require('../../../__mocks__/components/TrackEntryList.tsx'));

jest.mock('../../../src/components/ErrorView', () => require('../../../__mocks__/components/ErrorView.tsx'));

const mockGetList = jest.fn<void, Parameters<UseTrackListCallFunction>>();

interface TrackListHookState {
	loading: boolean;
	error?: Error;
	data?: TrackEntryListData;
	called: boolean;
	queryID?: string;
}

let hookState: TrackListHookState;

const useList: useTrackListFunction = () => [mockGetList, hookState];

function makeTrack(id: string): TrackEntry {
	return { id, duration: '3:00', durationMS: 180_000, trackNr: '1', title: `Track ${id}`, artist: 'Artist', album: 'Album' };
}

function makePage(count: number): Array<TrackEntry> {
	return Array.from({ length: count }, (_, index) => makeTrack(String(index)));
}

function makeQuery(overrides: Partial<TrackEntryListListQuery> = {}): TrackEntryListListQuery {
	return {
		icon: 'track',
		text: 'Top Tracks',
		listType: ListType.highest,
		useList,
		...overrides
	};
}

describe('TrackEntryListList', () => {
	beforeEach(() => {
		hookState = { loading: false, called: false };
	});

	describe('info header', () => {
		it('builds the info from icon, text and explicit subtitle', async () => {
			await render(<TrackEntryListList query={makeQuery({ subtitle: 'Custom subtitle' })} />);
			expect(lastProps<CapturedTrackListProps>(TrackEntryList)?.info).toEqual({ icon: 'track', title: 'Top Tracks', subtitle: 'Custom subtitle' });
		});

		it('falls back to the list-type name as the subtitle', async () => {
			await render(<TrackEntryListList query={makeQuery({ listType: ListType.frequent })} />);
			expect(lastProps<CapturedTrackListProps>(TrackEntryList)?.info.subtitle).toBe('Most Played');
		});
	});

	describe('data fetching', () => {
		it('fetches the list on mount when a list type is set', async () => {
			await render(<TrackEntryListList query={makeQuery({ listType: ListType.highest })} />);
			expect(mockGetList).toHaveBeenCalledTimes(1);
			expect(mockGetList).toHaveBeenCalledWith(ListType.highest, [], undefined, 20, 0);
		});

		it('fetches the list on mount when genre ids are set', async () => {
			await render(<TrackEntryListList query={makeQuery({ listType: undefined, genreIDs: ['g1', 'g2'] })} />);
			expect(mockGetList).toHaveBeenCalledTimes(1);
			expect(mockGetList).toHaveBeenCalledWith(undefined, ['g1', 'g2'], undefined, 20, 0);
		});

		it('does not fetch when neither a list type nor genre ids are set', async () => {
			await render(<TrackEntryListList query={makeQuery({ listType: undefined })} />);
			expect(mockGetList).not.toHaveBeenCalled();
		});
	});

	describe('entries', () => {
		it('starts with undefined entries before any data arrives', async () => {
			await render(<TrackEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedTrackListProps>(TrackEntryList)?.entries).toBeUndefined();
		});

		it('passes fetched items through to the list', async () => {
			const screen = await render(<TrackEntryListList query={makeQuery()} />);
			hookState = { loading: false, called: true, data: { items: [makeTrack('1'), makeTrack('2')], total: 2 } };
			await screen.rerender(<TrackEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedTrackListProps>(TrackEntryList)?.entries).toHaveLength(2);
		});

		it('appends further pages onto the existing entries', async () => {
			const screen = await render(<TrackEntryListList query={makeQuery()} />);
			hookState = { loading: false, called: true, data: { items: [makeTrack('1')], total: 3 } };
			await screen.rerender(<TrackEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedTrackListProps>(TrackEntryList)?.entries).toHaveLength(1);

			hookState = { loading: false, called: true, data: { items: [makeTrack('2'), makeTrack('3')], total: 3 } };
			await screen.rerender(<TrackEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedTrackListProps>(TrackEntryList)?.entries).toHaveLength(3);
		});
	});

	describe('display function', () => {
		it('hands the default list track display function to the list', async () => {
			await render(<TrackEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedTrackListProps>(TrackEntryList)?.displayFunc).toBe(defaultListTrackDisplay);
		});
	});

	describe('loading state', () => {
		it('passes the hook loading flag through as refreshing', async () => {
			hookState = { loading: true, called: true };
			await render(<TrackEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedTrackListProps>(TrackEntryList)?.refreshing).toBe(true);
		});
	});

	describe('error handling', () => {
		it('renders the error view and hides the list on error', async () => {
			hookState = { loading: false, called: true, error: new Error('boom') };
			await render(<TrackEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedErrorProps>(ErrorView)?.error).toBeInstanceOf(Error);
			expect(lastProps<CapturedTrackListProps>(TrackEntryList)).toBeUndefined();
		});
	});

	describe('load more', () => {
		it('requests the next page offset when more entries are available', async () => {
			const screen = await render(<TrackEntryListList query={makeQuery()} />);
			hookState = { loading: false, called: true, data: { items: makePage(20), total: 50 } };
			await screen.rerender(<TrackEntryListList query={makeQuery()} />);
			mockGetList.mockClear();

			await act(async () => {
				lastProps<CapturedTrackListProps>(TrackEntryList)?.onLoadMore();
			});

			expect(mockGetList).toHaveBeenCalledWith(ListType.highest, [], undefined, 20, 20);
		});

		it('does not request more while a fetch is in flight', async () => {
			const screen = await render(<TrackEntryListList query={makeQuery()} />);
			hookState = { loading: true, called: true, data: { items: makePage(20), total: 50 } };
			await screen.rerender(<TrackEntryListList query={makeQuery()} />);
			mockGetList.mockClear();

			await act(async () => {
				lastProps<CapturedTrackListProps>(TrackEntryList)?.onLoadMore();
			});

			expect(mockGetList).not.toHaveBeenCalled();
		});

		it('does not request more when all entries are already loaded', async () => {
			const screen = await render(<TrackEntryListList query={makeQuery()} />);
			hookState = { loading: false, called: true, data: { items: [makeTrack('1'), makeTrack('2')], total: 2 } };
			await screen.rerender(<TrackEntryListList query={makeQuery()} />);
			mockGetList.mockClear();

			await act(async () => {
				lastProps<CapturedTrackListProps>(TrackEntryList)?.onLoadMore();
			});

			expect(mockGetList).not.toHaveBeenCalled();
		});
	});

	describe('reload', () => {
		it('clears the cache key and refetches from the start', async () => {
			const screen = await render(<TrackEntryListList query={makeQuery()} />);
			hookState = { loading: false, called: true, data: { items: [makeTrack('1')], total: 3 }, queryID: 'query-abc-skip-0' };
			await screen.rerender(<TrackEntryListList query={makeQuery()} />);
			expect(lastProps<CapturedTrackListProps>(TrackEntryList)?.entries).toHaveLength(1);
			mockGetList.mockClear();

			await act(async () => {
				lastProps<CapturedTrackListProps>(TrackEntryList)?.onRefresh();
			});

			expect(jest.mocked(cacheService.removeKeyStartWith)).toHaveBeenCalledWith('query-abc-');
		});
	});
});
