import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, act } from '@testing-library/react-native';
import { HomeScreen } from '../../src/screens/HomeScreen';
import { JamImage } from '../../src/components/JamImage';
import { SearchResults } from '../../src/components/SearchResults';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { HomeMain } from '../../src/components/HomeMain';
import { SearchBar } from '../../src/components/SearchBar';
import { screenProps } from '../../__mocks__/screen-props.ts';

jest.mock('../../src/services/jam.auth.ts', () => require('../../__mocks__/services/jam.auth.ts'));

const mockHomeMain = jest.mocked(HomeMain);
const mockSearchResults = jest.mocked(SearchResults);
jest.mock('../../src/components/Logo', () => require('../../__mocks__/components/Logo.tsx'));
jest.mock('../../src/components/JamImage', () => require('../../__mocks__/components/JamImage.tsx'));
jest.mock('../../src/components/HomeMain', () => require('../../__mocks__/components/HomeMain.tsx'));
jest.mock('../../src/components/SearchResults', () => require('../../__mocks__/components/SearchResults.tsx'));
jest.mock('../../src/components/SearchBar', () => require('../../__mocks__/components/SearchBar.tsx'));

const mockSearchChange = (): ((query: string) => void) | undefined =>
	lastProps<{ searchQueryChange: (query: string) => void }>(SearchBar)?.searchQueryChange;

describe('HomeScreen', () => {
	it('shows the welcome text with the current user name', async () => {
		const screen = await render(<HomeScreen {...screenProps(HomeScreen)} />);
		expect(screen.getByText('Welcome, Test User')).toBeTruthy();
	});

	it('renders the user image for the current user id', async () => {
		await render(<HomeScreen {...screenProps(HomeScreen)} />);
		expect(lastProps(JamImage)).toEqual(expect.objectContaining({ id: 'user-1' }));
	});

	it('shows HomeMain when there is no active search', async () => {
		await render(<HomeScreen {...screenProps(HomeScreen)} />);
		expect(mockHomeMain).toHaveBeenCalled();
		expect(mockSearchResults).not.toHaveBeenCalled();
	});

	it('switches to SearchResults once the search bar reports a query', async () => {
		await render(<HomeScreen {...screenProps(HomeScreen)} />);
		mockSearchResults.mockClear();
		await act(async () => {
			mockSearchChange()?.('rock');
		});
		expect(lastProps(SearchResults)).toEqual(expect.objectContaining({ search: 'rock' }));
	});
});
