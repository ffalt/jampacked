import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Queue } from '../../../src/components/Queue';
import { QueueItem } from '../../../src/components/QueueItem';
import { TrackPlayerTrack } from '../../../src/services/player.api';
import { JamPlayer } from '../../../src/services/player.service';
import { useTrackPlayerQueue, useTrackPlayerCurrentTrackNr } from 'react-native-track-player';
import { ClickLabelIcon } from '../../../src/components/ClickLabelIcon';
import { DefaultFlatList } from '../../../src/components/DefaultFlatList';
import { lastProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/services/player.service.ts', () => require('../../../__mocks__/services/player.service.ts'));

jest.mock('../../../src/components/QueueItem', () => require('../../../__mocks__/components/QueueItem.tsx'));

interface LabelIconProps {
	iconName: string;
	label: string;
	onPress: () => void;
}

const mockClickLabelIcon = jest.mocked(ClickLabelIcon);

jest.mock('../../../src/components/ClickLabelIcon', () => require('../../../__mocks__/components/ClickLabelIcon.tsx'));

interface ListProps {
	items?: Array<TrackPlayerTrack>;
	renderItem: (info: { item: TrackPlayerTrack; index: number }) => React.ReactElement<{ active: boolean; index: number }>;
	ListHeaderComponent?: React.ReactElement;
}

jest.mock('../../../src/components/DefaultFlatList.tsx', () => require('../../../__mocks__/components/DefaultFlatList.tsx'));
jest.mocked(DefaultFlatList).mockImplementation(((properties: { ListHeaderComponent?: React.ReactElement }) => properties.ListHeaderComponent ?? null) as never);

let mockQueue: Array<TrackPlayerTrack> = [];
let mockCurrent = 0;

jest.mocked(useTrackPlayerQueue).mockImplementation(() => mockQueue);
jest.mocked(useTrackPlayerCurrentTrackNr).mockImplementation(() => mockCurrent);

function makeTrack(id: string): TrackPlayerTrack {
	return { id, url: `http://x/${id}`, title: `Track ${id}`, artist: 'Artist', duration: 180 };
}

function labelIcon(label: string): LabelIconProps {
	return mockClickLabelIcon.mock.calls.map(call => call[0]).find(properties => properties.label === label)!;
}

describe('Queue', () => {
	beforeEach(() => {
		mockQueue = [makeTrack('1'), makeTrack('2'), makeTrack('3')];
		mockCurrent = 0;
	});

	it('forwards the track player queue to the list', async () => {
		await render(<Queue />);
		expect(lastProps<ListProps>(DefaultFlatList)?.items).toEqual(mockQueue);
	});

	it('marks the current track as active and the others inactive', async () => {
		mockCurrent = 1;
		await render(<Queue />);
		const active = lastProps<ListProps>(DefaultFlatList)!.renderItem({ item: mockQueue[1], index: 1 });
		const inactive = lastProps<ListProps>(DefaultFlatList)!.renderItem({ item: mockQueue[0], index: 0 });
		expect(active.type).toBe(QueueItem);
		expect(active.props.active).toBe(true);
		expect(inactive.props.active).toBe(false);
	});

	it('renders the Clear and Shuffle header buttons', async () => {
		await render(<Queue />);
		const labels = mockClickLabelIcon.mock.calls.map(call => call[0].label);
		expect(labels).toEqual(['Clear', 'Shuffle']);
	});

	it('clears the queue when Clear is pressed', async () => {
		await render(<Queue />);
		labelIcon('Clear').onPress();
		expect(jest.mocked(JamPlayer.clearQueueSync)).toHaveBeenCalledTimes(1);
	});

	it('shuffles the queue when Shuffle is pressed', async () => {
		await render(<Queue />);
		labelIcon('Shuffle').onPress();
		expect(jest.mocked(JamPlayer.shuffleQueueSync)).toHaveBeenCalledTimes(1);
	});

	it('shows an empty queue without crashing', async () => {
		mockQueue = [];
		await render(<Queue />);
		expect(lastProps<ListProps>(DefaultFlatList)?.items).toEqual([]);
	});
});
