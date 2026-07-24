import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, act } from '@testing-library/react-native';
import { SearchResults } from '../../../src/components/SearchResults';
import { JamObjectType } from '../../../src/services/jam';
import { Search } from '../../../src/components/Search';
import { SearchQuick } from '../../../src/components/SearchQuick';
import { lastProps } from '../../../__mocks__/mock-props.ts';

interface QuickProps {
	query?: string;
	setObjType?: (objectType: JamObjectType) => void;
}

interface SearchProps {
	query?: string;
	objType: JamObjectType;
	backToAll?: () => void;
}

jest.mock('../../../src/components/SearchQuick', () => require('../../../__mocks__/components/SearchQuick.tsx'));
jest.mock('../../../src/components/Search', () => require('../../../__mocks__/components/Search.tsx'));

const mockLastQuickProps = (): QuickProps | undefined => lastProps<QuickProps>(SearchQuick);
const mockQuickRenders = (): number => jest.mocked(SearchQuick).mock.calls.length;

describe('SearchResults', () => {
	it('shows the quick autocomplete with the query initially', async () => {
		await render(<SearchResults search="abba" />);
		expect(mockLastQuickProps()?.query).toBe('abba');
		expect(lastProps<SearchProps>(Search)).toBeUndefined();
	});

	it('switches to the per-type results once an object type is picked', async () => {
		await render(<SearchResults search="abba" />);
		await act(async () => {
			mockLastQuickProps()?.setObjType?.(JamObjectType.album);
		});
		expect(lastProps<SearchProps>(Search)?.objType).toBe(JamObjectType.album);
		expect(lastProps<SearchProps>(Search)?.query).toBe('abba');
	});

	it('returns to the quick autocomplete when back-to-all is triggered', async () => {
		await render(<SearchResults search="abba" />);
		await act(async () => {
			mockLastQuickProps()?.setObjType?.(JamObjectType.album);
		});
		const rendersBeforeBack = mockQuickRenders();
		await act(async () => {
			lastProps<SearchProps>(Search)?.backToAll?.();
		});
		expect(mockQuickRenders()).toBeGreaterThan(rendersBeforeBack);
		expect(mockLastQuickProps()?.query).toBe('abba');
	});
});
