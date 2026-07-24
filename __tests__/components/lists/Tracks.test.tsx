import React from 'react';
import { StyleSheet } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render, act, fireEvent } from '@testing-library/react-native';
import type { TestInstance } from 'test-renderer';
import { Tracks } from '../../../src/components/Tracks';
import { TrackItem } from '../../../src/components/TrackItem';
import { executeTrackMenuAction } from '../../../src/components/ActionMenuTrack';
import { TrackEntry } from '../../../src/types/track';
import { ErrorView } from '../../../src/components/ErrorView';
import { DefaultFlatList } from '../../../src/components/DefaultFlatList';
import { lastProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/components/TrackItem', () => require('../../../__mocks__/components/TrackItem.tsx'));
jest.mock('../../../src/components/ThemedIcon', () => require('../../../__mocks__/components/ThemedIcon.tsx'));
jest.mock('../../../src/services/player.service.ts', () => require('../../../__mocks__/services/player.service.ts'));

jest.mock('../../../src/components/ActionMenuTrack', () => require('../../../__mocks__/components/ActionMenuTrack.tsx'));
jest.mocked(executeTrackMenuAction).mockResolvedValue(true);

interface ErrorViewProps {
	error: unknown;
	onRetry: () => void;
}

jest.mock('../../../src/components/ErrorView', () => require('../../../__mocks__/components/ErrorView.tsx'));

interface ListProps {
	items?: Array<TrackEntry>;
	renderItem: (info: { item: TrackEntry }) => React.ReactElement<{ track: TrackEntry; displayFunc?: unknown; setSelected: (item: TrackEntry) => void }>;
	loading: boolean;
	reload: () => void;
}

jest.mock('../../../src/components/DefaultFlatList.tsx', () => require('../../../__mocks__/components/DefaultFlatList.tsx'));

function makeTrack(id: string): TrackEntry {
	return { id, duration: '3:00', durationMS: 180_000, trackNr: '1', title: `Title ${id}`, artist: 'Artist', album: 'Album' };
}

function actionButtons(screen: Awaited<ReturnType<typeof render>>): Array<TestInstance> {
	if (!screen.root) {
		return [];
	}
	return screen.root.queryAll(node => {
		if (node.type !== 'View') {
			return false;
		}
		const style = StyleSheet.flatten(node.props.style) as { minWidth?: number };
		return style.minWidth === 56;
	});
}

async function selectTracks(...items: Array<TrackEntry>): Promise<void> {
	for (const item of items) {
		await act(async () => {
			lastProps<ListProps>(DefaultFlatList)!.renderItem({ item }).props.setSelected(item);
		});
	}
}

const tracks = [makeTrack('1'), makeTrack('2'), makeTrack('3')];

describe('Tracks', () => {
	it('forwards the tracks to the list and renders each through TrackItem', async () => {
		await render(<Tracks tracks={tracks} ListHeaderComponent={null} refreshing={false} onRefresh={jest.fn()} />);
		expect(lastProps<ListProps>(DefaultFlatList)?.items).toEqual(tracks);
		expect(lastProps<ListProps>(DefaultFlatList)!.renderItem({ item: tracks[0] }).type).toBe(TrackItem);
	});

	it('passes the display function to the rows', async () => {
		const displayFunction = jest.fn();
		await render(<Tracks tracks={tracks} ListHeaderComponent={null} refreshing={false} onRefresh={jest.fn()} displayFunc={displayFunction} />);
		expect(lastProps<ListProps>(DefaultFlatList)!.renderItem({ item: tracks[0] }).props.displayFunc).toBe(displayFunction);
	});

	it('renders an error view on error', async () => {
		const onRefresh = jest.fn();
		await render(<Tracks tracks={tracks} ListHeaderComponent={null} refreshing={false} onRefresh={onRefresh} error={new Error('boom')} />);
		expect(lastProps<ErrorViewProps>(ErrorView)?.error).toBeInstanceOf(Error);
	});

	it('shows no action bar when nothing is selected', async () => {
		const screen = await render(<Tracks tracks={tracks} ListHeaderComponent={null} refreshing={false} onRefresh={jest.fn()} />);
		expect(actionButtons(screen)).toHaveLength(0);
	});

	it('shows the single-select actions and count for one selected track', async () => {
		const screen = await render(<Tracks tracks={tracks} ListHeaderComponent={null} refreshing={false} onRefresh={jest.fn()} />);
		await selectTracks(tracks[0]);
		expect(screen.getByText(/1 track ·/)).toBeTruthy();
		await fireEvent.press(actionButtons(screen)[0]);
		expect(jest.mocked(executeTrackMenuAction)).toHaveBeenCalledWith([tracks[0]], 'bt_s_play');
	});

	it('uses the multi-select actions for several selected tracks', async () => {
		const screen = await render(<Tracks tracks={tracks} ListHeaderComponent={null} refreshing={false} onRefresh={jest.fn()} />);
		await selectTracks(tracks[0], tracks[1]);
		expect(screen.getByText(/2 tracks ·/)).toBeTruthy();
		await fireEvent.press(actionButtons(screen)[0]);
		expect(jest.mocked(executeTrackMenuAction)).toHaveBeenCalledWith([tracks[0], tracks[1]], 'bt_m_play');
	});

	it('clears the selection after a successful action', async () => {
		const screen = await render(<Tracks tracks={tracks} ListHeaderComponent={null} refreshing={false} onRefresh={jest.fn()} />);
		await selectTracks(tracks[0]);
		expect(actionButtons(screen)).toHaveLength(3);
		await act(async () => {
			await fireEvent.press(actionButtons(screen)[0]);
		});
		expect(actionButtons(screen)).toHaveLength(0);
	});
});
