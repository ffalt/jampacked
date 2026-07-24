import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchQuick } from '../../../src/components/SearchQuick';
import { JamObjectType } from '../../../src/services/jam';
import { AutoCompleteDataSection, AutoCompleteEntryData } from '../../../src/types/autocomplete';
import { NavigationService } from '../../../src/navigators/navigation';
import { DefaultSectionList } from '../../../src/components/DefaultSectionList';
import { lastProps } from '../../../__mocks__/mock-props.ts';
import { useLazyAutocompleteQuery } from '../../../src/services/queries/autocomplete';

jest.mock('../../../src/components/JamImage', () => require('../../../__mocks__/components/JamImage.tsx'));
jest.mock('../../../src/components/ThemedIcon', () => require('../../../__mocks__/components/ThemedIcon.tsx'));

jest.mock('../../../src/navigators/navigation', () => require('../../../__mocks__/navigators/navigation.ts'));

const mockGetAutocomplete = jest.fn();
let mockHookState: { loading: boolean; sections?: Array<AutoCompleteDataSection>; error?: Error; called: boolean };

jest.mock('../../../src/services/queries/autocomplete');
jest.mocked(useLazyAutocompleteQuery).mockImplementation(() => [mockGetAutocomplete, mockHookState] as never);

interface SectionListProps {
	sections: Array<AutoCompleteDataSection>;
	renderSectionHeader: (info: { section: AutoCompleteDataSection }) => React.ReactElement;
	renderItem: (info: { item: AutoCompleteEntryData }) => React.ReactElement;
	loading: boolean;
}

jest.mock('../../../src/components/DefaultSectionList.tsx', () => require('../../../__mocks__/components/DefaultSectionList.tsx'));

function makeEntry(id: string, name: string): AutoCompleteEntryData {
	return { id, name, objType: JamObjectType.artist };
}

function makeSection(key: string, count: number): AutoCompleteDataSection {
	return { key, objType: JamObjectType.artist, total: count, data: Array.from({ length: count }, (_, index) => makeEntry(`${key}${index}`, `${key} ${index}`)) };
}

describe('SearchQuick', () => {
	beforeEach(() => {
		mockHookState = { loading: false, called: false };
	});

	it('fetches autocomplete results when a query is given', async () => {
		await render(<SearchQuick query="abba" />);
		expect(mockGetAutocomplete).toHaveBeenCalledWith('abba');
	});

	it('does not fetch when there is no query', async () => {
		await render(<SearchQuick />);
		expect(mockGetAutocomplete).not.toHaveBeenCalled();
	});

	it('passes the loaded sections to the list', async () => {
		const sections = [makeSection('Artists', 2)];
		mockHookState = { loading: false, called: true, sections };
		await render(<SearchQuick query="a" />);
		expect(lastProps<SectionListProps>(DefaultSectionList)?.sections).toEqual(sections);
	});

	it('passes an empty section list while loading', async () => {
		mockHookState = { loading: true, called: true, sections: [makeSection('Artists', 2)] };
		await render(<SearchQuick query="a" />);
		expect(lastProps<SectionListProps>(DefaultSectionList)?.sections).toEqual([]);
	});

	it('selects the object type when a section header is pressed', async () => {
		const setObjectType = jest.fn();
		mockHookState = { loading: false, called: true, sections: [makeSection('Artists', 2)] };
		await render(<SearchQuick query="a" setObjType={setObjectType} />);
		const header = await render(lastProps<SectionListProps>(DefaultSectionList)!.renderSectionHeader({ section: makeSection('Artists', 2) }));
		await fireEvent.press(header.getByText('Artists'));
		expect(setObjectType).toHaveBeenCalledWith(JamObjectType.artist);
	});

	it('navigates to the entry when an item is pressed', async () => {
		jest.mocked(NavigationService.routeByObjType).mockReturnValue('ArtistRoute');
		mockHookState = { loading: false, called: true, sections: [makeSection('Artists', 2)] };
		await render(<SearchQuick query="a" />);
		const item = await render(lastProps<SectionListProps>(DefaultSectionList)!.renderItem({ item: makeEntry('a1', 'Abba') }));
		await fireEvent.press(item.getByText('Abba'));
		expect(jest.mocked(NavigationService.navigate)).toHaveBeenCalledWith('ArtistRoute', { id: 'a1', name: 'Abba' });
	});
});
