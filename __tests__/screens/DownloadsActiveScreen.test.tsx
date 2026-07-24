import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { DownloadsActiveScreen } from '../../src/screens/DownloadsActiveScreen';
import { useTrackPlayerCurrentDownloadsCached } from 'react-native-track-player';
import pinService from '../../src/services/pin.service';
import { DownloadsPage } from '../../src/components/Downloads';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { screenProps } from '../../__mocks__/screen-props.ts';

jest.mock('../../src/services/pin.service.ts', () => require('../../__mocks__/services/pin.service.ts'));

const mockDownloads = [{ id: 'a1' }];

jest.mocked(useTrackPlayerCurrentDownloadsCached).mockReturnValue(mockDownloads as never);

interface PageProps {
	downloads?: Array<{ id: string }>;
	title: string;
}

jest.mock('../../src/components/Downloads', () => require('../../__mocks__/components/Downloads.tsx'));

describe('DownloadsActiveScreen', () => {
	it('subscribes to the active downloads', async () => {
		await render(<DownloadsActiveScreen {...screenProps(DownloadsActiveScreen)} />);
		expect(jest.mocked(useTrackPlayerCurrentDownloadsCached)).toHaveBeenCalledWith(pinService.manager);
		expect(lastProps<PageProps>(DownloadsPage)?.downloads).toBe(mockDownloads);
	});

	it('renders the downloads list/page', async () => {
		await render(<DownloadsActiveScreen {...screenProps(DownloadsActiveScreen)} />);
		expect(lastProps<PageProps>(DownloadsPage)).toBeDefined();
		expect(lastProps<PageProps>(DownloadsPage)?.title).toBe('Active Downloads');
	});
});
