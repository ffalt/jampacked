import React from 'react';
import { StyleSheet } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent, act } from '@testing-library/react-native';
import { SearchBar } from '../../../src/components/SearchBar';
import type { ClickIconProps } from '../../helpers/test-types';
import { ClickIcon } from '../../../src/components/ClickIcon';

const mockClickIcon = jest.mocked(ClickIcon);

jest.mock('../../../src/components/ClickIcon', () => require('../../../__mocks__/components/ClickIcon.tsx'));

function lastIcon(name: string): ClickIconProps | undefined {
	const properties = mockClickIcon.mock.calls.map(call => call[0]);
	for (let index = properties.length - 1; index >= 0; index--) {
		if (properties[index].iconName === name) {
			return properties[index];
		}
	}
	return undefined;
}

describe('SearchBar', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	it('renders the search input with its placeholder', async () => {
		const screen = await render(<SearchBar />);
		expect(screen.getByPlaceholderText('Search')).toBeTruthy();
	});

	it('reports the typed query through searchQueryChange', async () => {
		const searchQueryChange = jest.fn();
		const screen = await render(<SearchBar searchQueryChange={searchQueryChange} />);
		await fireEvent.changeText(screen.getByPlaceholderText('Search'), 'abba');
		expect(searchQueryChange).toHaveBeenCalledWith('abba');
	});

	it('reports an empty query when the field is cleared to empty text', async () => {
		const searchQueryChange = jest.fn();
		const screen = await render(<SearchBar searchQueryChange={searchQueryChange} />);
		await fireEvent.changeText(screen.getByPlaceholderText('Search'), '');
		expect(searchQueryChange).toHaveBeenCalledWith('');
	});

	it('shows no cancel button while the field is empty', async () => {
		await render(<SearchBar />);
		expect(lastIcon('cancel')).toBeUndefined();
	});

	it('shows a cancel button once text is entered', async () => {
		const screen = await render(<SearchBar />);
		await fireEvent.changeText(screen.getByPlaceholderText('Search'), 'abba');
		expect(lastIcon('cancel')).toBeDefined();
	});

	it('clears the query when the cancel button is pressed', async () => {
		const searchQueryChange = jest.fn();
		const screen = await render(<SearchBar searchQueryChange={searchQueryChange} />);
		await fireEvent.changeText(screen.getByPlaceholderText('Search'), 'abba');
		searchQueryChange.mockClear();
		await act(async () => {
			lastIcon('cancel')!.onPress();
		});
		expect(searchQueryChange).toHaveBeenCalledWith(undefined);
	});

	it('dims the search icon while the field is empty', async () => {
		await render(<SearchBar />);
		const style = StyleSheet.flatten(lastIcon('search')!.style) as { opacity?: number };
		expect(style.opacity).toBe(0.3);
	});
});
