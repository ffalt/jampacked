import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { DownloadsScreen } from '../../src/screens/DownloadsScreen';
import { useTrackPlayerDownloadsCached } from 'react-native-track-player';
import pinService from '../../src/services/pin.service';
import { DownloadsPage } from '../../src/components/Downloads';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { screenProps } from '../../__mocks__/screen-props.ts';

jest.mock('../../src/services/pin.service.ts', () => require('../../__mocks__/services/pin.service.ts'));

const mockDownloads = [{ id: 'd1' }, { id: 'd2' }];

jest.mocked(useTrackPlayerDownloadsCached).mockReturnValue(mockDownloads as never);

interface PageProps {
	downloads?: Array<{ id: string }>;
	title: string;
}

jest.mock('../../src/components/Downloads', () => require('../../__mocks__/components/Downloads.tsx'));

describe('DownloadsScreen', () => {
	it('passes the active downloads to DownloadsPage', async () => {
		await render(<DownloadsScreen {...screenProps(DownloadsScreen)} />);
		expect(jest.mocked(useTrackPlayerDownloadsCached)).toHaveBeenCalledWith(pinService.manager);
		expect(lastProps<PageProps>(DownloadsPage)?.downloads).toBe(mockDownloads);
	});

	it('reflects the downloads title', async () => {
		await render(<DownloadsScreen {...screenProps(DownloadsScreen)} />);
		expect(lastProps<PageProps>(DownloadsPage)?.title).toBe('All Downloads');
	});
});
