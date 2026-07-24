import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { TrackEntryList, TrackEntryListInfo } from '../../../src/components/TrackEntryList';
import { TrackEntry } from '../../../src/types/track';
import { Tracks } from '../../../src/components/Tracks';
import { lastProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/components/PageHeader', () => require('../../../__mocks__/components/PageHeader.tsx'));

interface CapturedTracksProps {
	tracks?: Array<TrackEntry>;
	ListHeaderComponent?: React.ReactElement<{ title: string; subtitle?: string; goLeft?: unknown; goRight?: unknown }>;
	refreshing: boolean;
	onRefresh: () => void;
	onLoadMore?: () => void;
	displayFunc?: unknown;
}

jest.mock('../../../src/components/Tracks', () => require('../../../__mocks__/components/Tracks.tsx'));

const info: TrackEntryListInfo = { title: 'Tracks', subtitle: 'All tracks', icon: 'track' };

function makeTrack(id: string): TrackEntry {
	return { id, duration: '3:00', durationMS: 180_000, trackNr: '1', title: `Track ${id}`, artist: 'Artist', album: 'Album' };
}

async function renderList(overrides: Partial<React.ComponentProps<typeof TrackEntryList>> = {}): ReturnType<typeof render> {
	const properties: React.ComponentProps<typeof TrackEntryList> = {
		info,
		entries: [makeTrack('1'), makeTrack('2')],
		refreshing: false,
		onRefresh: jest.fn(),
		onLoadMore: jest.fn(),
		...overrides
	};
	return render(<TrackEntryList {...properties} />);
}

describe('TrackEntryList', () => {
	it('forwards the entries to Tracks', async () => {
		const entries = [makeTrack('1'), makeTrack('2')];
		await renderList({ entries });
		expect(lastProps<CapturedTracksProps>(Tracks)?.tracks).toEqual(entries);
	});

	it('builds the header from the info title and subtitle', async () => {
		await renderList();
		expect(lastProps<CapturedTracksProps>(Tracks)?.ListHeaderComponent?.props.title).toBe('Tracks');
		expect(lastProps<CapturedTracksProps>(Tracks)?.ListHeaderComponent?.props.subtitle).toBe('All tracks');
	});

	it('passes the navigation links to the header', async () => {
		const goLeft = { navig: { route: 'Prev' } } as never;
		const goRight = { navig: { route: 'Next' } } as never;
		await renderList({ goLeft, goRight });
		expect(lastProps<CapturedTracksProps>(Tracks)?.ListHeaderComponent?.props.goLeft).toBe(goLeft);
		expect(lastProps<CapturedTracksProps>(Tracks)?.ListHeaderComponent?.props.goRight).toBe(goRight);
	});

	it('reflects the refreshing prop', async () => {
		await renderList({ refreshing: true });
		expect(lastProps<CapturedTracksProps>(Tracks)?.refreshing).toBe(true);
	});

	it('wires onRefresh and onLoadMore through to Tracks', async () => {
		const onRefresh = jest.fn();
		const onLoadMore = jest.fn();
		await renderList({ onRefresh, onLoadMore });
		lastProps<CapturedTracksProps>(Tracks)?.onRefresh();
		lastProps<CapturedTracksProps>(Tracks)?.onLoadMore?.();
		expect(onRefresh).toHaveBeenCalledTimes(1);
		expect(onLoadMore).toHaveBeenCalledTimes(1);
	});

	it('forwards the display function', async () => {
		const displayFunction = jest.fn();
		await renderList({ displayFunc: displayFunction });
		expect(lastProps<CapturedTracksProps>(Tracks)?.displayFunc).toBe(displayFunction);
	});
});
