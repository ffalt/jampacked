import React from 'react';
import { StyleSheet } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { ActiveDownloadItem } from '../../../src/components/ActiveDownloadItem';
import { TrackEntry } from '../../../src/types/track';
import type { Download } from 'react-native-track-player';

import { downloadStateToString } from '../../../src/services/player.api';
import { usePinnedMediaDownload } from '../../../src/services/pin.hooks';

jest.mock('../../../src/services/player.api.ts', () => require('../../../__mocks__/services/player.api.ts'));
jest.mock('../../../src/services/pin.hooks.ts', () => require('../../../__mocks__/services/pin.hooks.ts'));

jest.mocked(downloadStateToString).mockReturnValue('Downloading');

let mockPinDownload: { download?: Partial<Download>; track?: TrackEntry };

jest.mocked(usePinnedMediaDownload).mockImplementation(() => mockPinDownload as never);

function makeDownload(overrides: Partial<Download> = {}): Download {
	return { id: 'd1', url: 'http://x/d1', state: 2, contentLength: 1000, bytesDownloaded: 512, percentDownloaded: 50, failureReason: 0, stopReason: 0, startTimeMs: 0, updateTimeMs: 0, ...overrides };
}

function makeTrack(): TrackEntry {
	return { id: 'd1', duration: '3:00', durationMS: 180_000, trackNr: '1', title: 'Song', artist: 'Artist', album: 'Album' };
}

interface HostNode {
	type: string;
	props: Record<string, any>;
}

function fillWidth(screen: Awaited<ReturnType<typeof render>>): string | undefined {
	const views = screen.root!.queryAll(node => (node as unknown as HostNode).type === 'View') as unknown as Array<HostNode>;
	const fill = views.find(view => {
		const style = StyleSheet.flatten(view.props.style) as { width?: string };
		return typeof style.width === 'string';
	});
	return (StyleSheet.flatten(fill!.props.style) as { width?: string }).width;
}

describe('ActiveDownloadItem', () => {
	beforeEach(() => {
		mockPinDownload = {};
	});

	it('shows the track album-title when the track is resolved', async () => {
		mockPinDownload = { track: makeTrack() };
		const screen = await render(<ActiveDownloadItem item={makeDownload()} />);
		expect(screen.getByText('Album-Song')).toBeTruthy();
	});

	it('shows a loading label when the track is not resolved', async () => {
		mockPinDownload = {};
		const screen = await render(<ActiveDownloadItem item={makeDownload()} />);
		expect(screen.getByText('Loading')).toBeTruthy();
	});

	it('shows the download state string', async () => {
		const screen = await render(<ActiveDownloadItem item={makeDownload()} />);
		expect(screen.getByText('Downloading')).toBeTruthy();
	});

	it('shows the download percentage', async () => {
		const screen = await render(<ActiveDownloadItem item={makeDownload({ percentDownloaded: 50 })} />);
		expect(screen.getByText(/50\.00\s*%/)).toBeTruthy();
	});

	it('sizes the fill bar to the percentage', async () => {
		const screen = await render(<ActiveDownloadItem item={makeDownload({ percentDownloaded: 50 })} />);
		expect(fillWidth(screen)).toBe('50%');
	});

	it('prefers the live download over the item for the progress', async () => {
		mockPinDownload = { download: makeDownload({ percentDownloaded: 80 }) };
		const screen = await render(<ActiveDownloadItem item={makeDownload({ percentDownloaded: 10 })} />);
		expect(fillWidth(screen)).toBe('80%');
	});
});
