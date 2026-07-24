import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PinnedMediaScreen } from '../../src/screens/PinnedMediaScreen';
import { usePinnedMedia } from '../../src/services/pin.hooks';
import { PageHeader } from '../../src/components/PageHeader';
import { DefaultSectionList } from '../../src/components/DefaultSectionList';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { screenProps } from '../../__mocks__/screen-props.ts';

jest.mock('../../src/services/pin.hooks.ts', () => require('../../__mocks__/services/pin.hooks.ts'));

interface Media {
	id: string;
	tracks: Array<{ id: string }>;
}

let mockMedia: Array<Media>;
let mockLoading: boolean;

jest.mocked(usePinnedMedia).mockImplementation(() => ({ media: mockMedia, loading: mockLoading }) as never);

interface HeaderProps {
	title: string;
	subtitle?: string;
}

interface SectionListProps {
	sections: Array<unknown>;
	loading?: boolean;
	ListHeaderComponent?: React.ReactElement;
}

jest.mock('../../src/components/PageHeader', () => require('../../__mocks__/components/PageHeader.tsx'));

jest.mock('../../src/components/DefaultSectionList.tsx', () => require('../../__mocks__/components/DefaultSectionList.tsx'));
jest.mocked(DefaultSectionList).mockImplementation(((properties: { ListHeaderComponent?: React.ReactElement }) => properties.ListHeaderComponent ?? null) as never);

jest.mock('../../src/components/PinnedMediaItem', () => require('../../__mocks__/components/PinnedMediaItem.tsx'));
jest.mock('../../src/components/TrackItem', () => require('../../__mocks__/components/TrackItem.tsx'));
jest.mock('../../src/components/Separator', () => require('../../__mocks__/components/Separator.tsx'));
jest.mock('../../src/services/player.api.ts', () => require('../../__mocks__/services/player.api.ts'));
jest.mock('../../src/services/pin.service.ts', () => require('../../__mocks__/services/pin.service.ts'));

describe('PinnedMediaScreen', () => {
	beforeEach(() => {
		mockMedia = [{ id: 'p1', tracks: [{ id: 't1' }] }];
		mockLoading = false;
	});

	it('renders the page header', async () => {
		await render(<PinnedMediaScreen {...screenProps(PinnedMediaScreen)} />);
		expect(lastProps<HeaderProps>(PageHeader)?.title).toBe('Media');
		expect(lastProps<HeaderProps>(PageHeader)?.subtitle).toBe('Pinned');
	});

	it('renders the pinned media list', async () => {
		await render(<PinnedMediaScreen {...screenProps(PinnedMediaScreen)} />);
		expect(lastProps<SectionListProps>(DefaultSectionList)).toBeDefined();
		expect(lastProps<SectionListProps>(DefaultSectionList)?.sections).toHaveLength(1);
		expect(lastProps<SectionListProps>(DefaultSectionList)?.loading).toBe(false);
	});
});
