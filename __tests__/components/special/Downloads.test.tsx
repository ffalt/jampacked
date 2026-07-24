import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { DownloadsPage } from '../../../src/components/Downloads';
import TrackPlayer, { type Download, useTrackPlayerDownloadsPaused } from 'react-native-track-player';
import { ClickLabelIcon } from '../../../src/components/ClickLabelIcon';
import { DefaultFlatList } from '../../../src/components/DefaultFlatList';
import { lastProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/components/ActiveDownloadItem', () => require('../../../__mocks__/components/ActiveDownloadItem.tsx'));
jest.mock('../../../src/components/PageHeader', () => require('../../../__mocks__/components/PageHeader.tsx'));

interface LabelIconProps {
	iconName: string;
	label: string;
	onPress: () => void;
}

jest.mock('../../../src/components/ClickLabelIcon', () => require('../../../__mocks__/components/ClickLabelIcon.tsx'));

interface ListProps {
	items?: Array<Download>;
	ListHeaderComponent?: React.ReactElement;
}

jest.mock('../../../src/components/DefaultFlatList.tsx', () => require('../../../__mocks__/components/DefaultFlatList.tsx'));
jest.mocked(DefaultFlatList).mockImplementation(((properties: { ListHeaderComponent?: React.ReactElement }) => properties.ListHeaderComponent ?? null) as never);

let mockPaused = false;

jest.mocked(useTrackPlayerDownloadsPaused).mockImplementation(() => mockPaused);

function makeDownload(id: string): Download {
	return { id, url: `http://x/${id}`, state: 2, contentLength: 1000, bytesDownloaded: 0, percentDownloaded: 0, failureReason: 0, stopReason: 0, startTimeMs: 0, updateTimeMs: 0 };
}

describe('DownloadsPage', () => {
	beforeEach(() => {
		mockPaused = false;
	});

	it('forwards the downloads to the list', async () => {
		const downloads = [makeDownload('1'), makeDownload('2')];
		await render(<DownloadsPage title="Downloads" downloads={downloads} />);
		expect(lastProps<ListProps>(DefaultFlatList)?.items).toEqual(downloads);
	});

	it('shows a pause action when downloads are running', async () => {
		mockPaused = false;
		await render(<DownloadsPage title="Downloads" />);
		expect(lastProps<LabelIconProps>(ClickLabelIcon)?.label).toBe('Pause Downloads');
		expect(lastProps<LabelIconProps>(ClickLabelIcon)?.iconName).toBe('pause');
	});

	it('shows a resume action when downloads are paused', async () => {
		mockPaused = true;
		await render(<DownloadsPage title="Downloads" />);
		expect(lastProps<LabelIconProps>(ClickLabelIcon)?.label).toBe('Resume Downloads');
		expect(lastProps<LabelIconProps>(ClickLabelIcon)?.iconName).toBe('play');
	});

	it('pauses running downloads when the toggle is pressed', async () => {
		mockPaused = false;
		await render(<DownloadsPage title="Downloads" />);
		lastProps<LabelIconProps>(ClickLabelIcon)?.onPress();
		expect(jest.mocked(TrackPlayer.pauseDownloads)).toHaveBeenCalledTimes(1);
		expect(jest.mocked(TrackPlayer.resumeDownloads)).not.toHaveBeenCalled();
	});

	it('resumes paused downloads when the toggle is pressed', async () => {
		mockPaused = true;
		await render(<DownloadsPage title="Downloads" />);
		lastProps<LabelIconProps>(ClickLabelIcon)?.onPress();
		expect(jest.mocked(TrackPlayer.resumeDownloads)).toHaveBeenCalledTimes(1);
		expect(jest.mocked(TrackPlayer.pauseDownloads)).not.toHaveBeenCalled();
	});
});
