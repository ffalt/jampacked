import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { SeriesScreen } from '../../src/screens/SeriesScreen';
import { NavigationService } from '../../src/navigators/navigation';
import { ObjectHeader } from '../../src/components/ObjectHeader';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { useLazySeriesQuery } from '../../src/services/queries/series';
import { DefaultSectionList } from '../../src/components/DefaultSectionList';
import { routeProps } from '../../__mocks__/screen-props.ts';

interface HeaderDetail {
	title: string;
	value: string;
	click?: () => void;
}

interface Series {
	artistName?: string;
	artistID?: string;
	tracksCount?: number;
	sections: Array<unknown>;
}

interface SeriesState {
	loading: boolean;
	error?: Error;
	series?: Series;
}

const mockGetSeries = jest.fn();
let mockState: SeriesState;

jest.mock('../../src/services/queries/series');
jest.mocked(useLazySeriesQuery).mockImplementation(() => [mockGetSeries, mockState] as never);

jest.mock('../../src/navigators/navigation', () => require('../../__mocks__/navigators/navigation.ts'));

interface ObjectHeaderProps {
	id: string;
	title: string;
	typeName?: string;
	details?: Array<HeaderDetail>;
}

interface SectionListProps {
	sections?: Array<unknown>;
	error?: Error;
	loading?: boolean;
	ListHeaderComponent?: React.ReactElement;
}

const mockSectionList = jest.mocked(DefaultSectionList);
mockSectionList.mockImplementation(((properties: SectionListProps) => properties.ListHeaderComponent ?? null) as never);

jest.mock('../../src/components/ObjectHeader.tsx', () => require('../../__mocks__/components/ObjectHeader.tsx'));
jest.mock('../../src/components/DefaultSectionList.tsx', () => require('../../__mocks__/components/DefaultSectionList.tsx'));
jest.mock('../../src/components/FavIcon', () => require('../../__mocks__/components/FavIcon.tsx'));
jest.mock('../../src/components/Rating', () => require('../../__mocks__/components/Rating.tsx'));
jest.mock('../../src/components/Item', () => require('../../__mocks__/components/Item.tsx'));
jest.mock('../../src/components/ThemedText', () => require('../../__mocks__/components/ThemedText.tsx'));

const series: Series = {
	artistName: 'The Author',
	artistID: 'artist-9',
	tracksCount: 12,
	sections: [{ title: 'Season 1', data: [] }]
};

async function renderScreen(id = 'series-1', name = 'My Series'): Promise<ReturnType<typeof render>> {
	return render(<SeriesScreen {...routeProps(SeriesScreen, { id, name })} />);
}

describe('SeriesScreen', () => {
	beforeEach(() => {
		mockState = { loading: false, series };
	});

	it('fetches the entity for the context id', async () => {
		await renderScreen('series-42');
		expect(mockGetSeries).toHaveBeenCalledWith('series-42');
	});

	it('renders the header / details', async () => {
		await renderScreen('series-1', 'My Series');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.title).toBe('My Series');
		expect(lastProps<ObjectHeaderProps>(ObjectHeader)?.typeName).toBe('Series');
		const details = lastProps<ObjectHeaderProps>(ObjectHeader)?.details ?? [];
		expect(details[0]).toEqual(expect.objectContaining({ title: 'Artist', value: 'The Author' }));
		expect(details[1]).toEqual(expect.objectContaining({ title: 'Tracks', value: '12' }));
		details[0].click?.();
		expect(jest.mocked(NavigationService.navigate)).toHaveBeenCalled();
	});

	it('renders the content list (and error/empty state)', async () => {
		await renderScreen();
		expect(lastProps<SectionListProps>(DefaultSectionList)?.sections).toBe(series.sections);

		const error = new Error('failed');
		mockState = { loading: false, error, series: undefined };
		await renderScreen();
		expect(lastProps<SectionListProps>(DefaultSectionList)?.error).toBe(error);
		expect(lastProps<SectionListProps>(DefaultSectionList)?.sections).toBeUndefined();
	});
});
