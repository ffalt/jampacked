import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { ArtistIndexScreen } from '../../src/screens/ArtistIndexScreen';
import { AlbumType } from '../../src/services/jam';
import { IndexList } from '../../src/components/IndexList';
import { ErrorView } from '../../src/components/ErrorView';
import { useLazyArtistIndexQuery } from '../../src/services/queries/artistIndex';
import { lastProps } from '../../__mocks__/mock-props.ts';
import type { IndexListProps, ErrorViewProps, IndexState } from '../helpers/test-types.ts';
import { screenProps } from '../../__mocks__/screen-props.ts';

jest.mock('../../src/services/queries/artistIndex');
jest.mock('../../src/navigators/Routes', () => require('../../__mocks__/navigators/Routes.ts'));
jest.mock('../../src/components/IndexList', () => require('../../__mocks__/components/IndexList.tsx'));
jest.mock('../../src/components/ErrorView', () => require('../../__mocks__/components/ErrorView.tsx'));

const mockGetIndex = jest.fn();

function setState(state: IndexState): void {
	jest.mocked(useLazyArtistIndexQuery).mockReturnValue([mockGetIndex, state] as never);
}

describe('ArtistIndexScreen', () => {
	beforeEach(() => {
		setState({ loading: false, called: false, index: undefined });
	});

	it('fetches the index on mount (with context/route params where relevant)', async () => {
		await render(<ArtistIndexScreen {...screenProps(ArtistIndexScreen)} />);
		expect(mockGetIndex).toHaveBeenCalledWith([AlbumType.album]);
	});

	it('passes the index, title, loading and reload to IndexList', async () => {
		const index = [{ letter: 'A', items: [] }];
		setState({ loading: true, called: true, index });
		await render(<ArtistIndexScreen {...screenProps(ArtistIndexScreen)} />);
		const properties = lastProps<IndexListProps>(IndexList);
		expect(properties?.index).toBe(index);
		expect(properties?.title).toBe('Artists');
		expect(properties?.refreshing).toBe(true);
		expect(typeof properties?.onRefresh).toBe('function');
	});

	it('renders an ErrorView on error (onRetry re-fetches)', async () => {
		const error = new Error('failed');
		setState({ loading: false, called: true, error });
		await render(<ArtistIndexScreen {...screenProps(ArtistIndexScreen)} />);
		const properties = lastProps<ErrorViewProps>(ErrorView);
		expect(properties?.error).toBe(error);
		expect(IndexList).not.toHaveBeenCalled();

		mockGetIndex.mockClear();
		properties?.onRetry();
		expect(mockGetIndex).toHaveBeenCalledWith([AlbumType.album], true);
	});
});
