import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { BookmarksScreen } from '../../src/screens/BookmarksScreen';
import { Tracks } from '../../src/components/Tracks';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { useLazyBookmarksQuery } from '../../src/services/queries/bookmarks';
import { screenProps } from '../../__mocks__/screen-props.ts';

interface BookmarksState {
	loading: boolean;
	error?: Error;
	called: boolean;
	bookmarks?: { tracks: Array<{ id: string }> };
}

const mockGetBookmarks = jest.fn();
let mockState: BookmarksState;

jest.mock('../../src/services/queries/bookmarks.ts');
jest.mocked(useLazyBookmarksQuery).mockImplementation(() => [mockGetBookmarks, mockState] as never);

interface TracksProps {
	tracks?: Array<{ id: string }>;
	refreshing?: boolean;
	error?: Error;
}

jest.mock('../../src/components/Tracks.tsx', () => require('../../__mocks__/components/Tracks.tsx'));

jest.mock('../../src/components/PageHeader.tsx', () => require('../../__mocks__/components/PageHeader.tsx'));
jest.mock('../../src/components/ClickIcon.tsx', () => require('../../__mocks__/components/ClickIcon.tsx'));
jest.mock('../../src/components/ObjectHeader.tsx', () => require('../../__mocks__/components/ObjectHeader.tsx'));
jest.mock('../../src/services/player.service.ts', () => require('../../__mocks__/services/player.service.ts'));

describe('BookmarksScreen', () => {
	beforeEach(() => {
		mockState = { loading: false, called: false, bookmarks: { tracks: [{ id: 't1' }] } };
	});

	it('fetches the bookmarks', async () => {
		await render(<BookmarksScreen {...screenProps(BookmarksScreen)} />);
		expect(mockGetBookmarks).toHaveBeenCalledWith(20, 0);
	});

	it('renders the bookmarks list (and empty/error state)', async () => {
		const { rerender } = await render(<BookmarksScreen {...screenProps(BookmarksScreen)} />);
		expect(lastProps<TracksProps>(Tracks)?.tracks).toEqual([{ id: 't1' }]);

		const error = new Error('failed');
		mockState = { loading: false, called: true, error, bookmarks: undefined };
		await rerender(<BookmarksScreen {...screenProps(BookmarksScreen)} />);
		expect(lastProps<TracksProps>(Tracks)?.tracks).toBeUndefined();
		expect(lastProps<TracksProps>(Tracks)?.error).toBe(error);
	});
});
