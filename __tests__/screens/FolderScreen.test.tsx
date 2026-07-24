import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { FolderScreen } from '../../src/screens/FolderScreen';
import { FolderType } from '../../src/services/jam';
import { ObjectHeader } from '../../src/components/ObjectHeader';
import { ErrorView } from '../../src/components/ErrorView';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { useLazyFolderQuery } from '../../src/services/queries/folder';
import { DefaultFlatList } from '../../src/components/DefaultFlatList';
import { routeProps } from '../../__mocks__/screen-props.ts';

interface HeaderDetail {
	title: string;
	value: string;
}

interface Folder {
	type?: FolderType;
	artist?: string;
	trackCount?: number;
	folderCount?: number;
	genres?: Array<{ id: string; name: string }>;
	tracks?: Array<{ id: string }>;
	items?: Array<unknown>;
}

interface FolderState {
	loading: boolean;
	error?: Error;
	folder?: Folder;
}

const mockGetFolder = jest.fn();
let mockState: FolderState;

jest.mock('../../src/services/queries/folder');
jest.mocked(useLazyFolderQuery).mockImplementation(() => [mockGetFolder, mockState] as never);

jest.mock('../../src/services/player.service.ts', () => require('../../__mocks__/services/player.service.ts'));
jest.mock('../../src/components/ActionMenuTrack', () => require('../../__mocks__/components/ActionMenuTrack.tsx'));

interface ObjectHeaderProps {
	id: string;
	title: string;
	typeName?: string;
	details?: Array<HeaderDetail>;
}

interface FlatListProps {
	items?: Array<unknown>;
	error?: Error;
	loading?: boolean;
	ListHeaderComponent?: React.ReactElement;
}

interface ErrorViewProps {
	error: unknown;
	onRetry: () => void;
}

const mockFlatList = jest.mocked(DefaultFlatList);
mockFlatList.mockImplementation(((properties: FlatListProps) => properties.ListHeaderComponent ?? null) as never);

jest.mock('../../src/components/ObjectHeader.tsx', () => require('../../__mocks__/components/ObjectHeader.tsx'));
jest.mock('../../src/components/DefaultFlatList.tsx', () => require('../../__mocks__/components/DefaultFlatList.tsx'));
jest.mock('../../src/components/ErrorView', () => require('../../__mocks__/components/ErrorView.tsx'));
jest.mock('../../src/components/TrackItem', () => require('../../__mocks__/components/TrackItem.tsx'));
jest.mock('../../src/components/Item', () => require('../../__mocks__/components/Item.tsx'));
jest.mock('../../src/components/ClickIcon', () => require('../../__mocks__/components/ClickIcon.tsx'));
jest.mock('../../src/components/Rating', () => require('../../__mocks__/components/Rating.tsx'));
jest.mock('../../src/components/ThemedText', () => require('../../__mocks__/components/ThemedText.tsx'));
jest.mock('../../src/components/ThemedIcon', () => require('../../__mocks__/components/ThemedIcon.tsx'));

const folder: Folder = {
	type: FolderType.album,
	artist: 'The Artist',
	trackCount: 5,
	genres: [{ id: 'genre-1', name: 'Rock' }],
	tracks: [{ id: 't1' }],
	items: [{ id: 'i1' }, { id: 'i2' }]
};

async function renderScreen(id = 'folder-1', name = 'My Folder'): Promise<ReturnType<typeof render>> {
	return render(<FolderScreen {...routeProps(FolderScreen, { id, name })} />);
}

describe('FolderScreen', () => {
	beforeEach(() => {
		mockState = { loading: false, folder };
	});

	it('fetches the entity for the context id', async () => {
		await renderScreen('folder-42');
		expect(mockGetFolder).toHaveBeenCalledWith('folder-42');
	});

	it('renders the header / details', async () => {
		await renderScreen('folder-1', 'My Folder');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.title).toBe('My Folder');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.typeName).toBe(FolderType.album);
		const details = lastProps<ObjectHeaderProps>(ObjectHeader)?.details ?? [];
		expect(details).toEqual(expect.arrayContaining([
			expect.objectContaining({ title: 'Artist', value: 'The Artist' }),
			expect.objectContaining({ title: 'Tracks', value: '5' })
		]));
	});

	it('renders the content list (and error/empty state)', async () => {
		await renderScreen();
		expect(lastProps<FlatListProps>(DefaultFlatList)?.items).toBe(folder.items);

		const error = new Error('failed');
		mockState = { loading: false, error, folder: undefined };
		mockFlatList.mockClear();
		await renderScreen();
		expect(lastProps<ErrorViewProps>(ErrorView)?.error).toBe(error);
		expect(mockFlatList).not.toHaveBeenCalled();
	});
});
