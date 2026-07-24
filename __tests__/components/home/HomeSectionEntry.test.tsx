import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeSectionEntry } from '../../../src/components/HomeSectionEntry';
import { HomeEntry } from '../../../src/types/home';
import { NavigationService } from '../../../src/navigators/navigation';
import { JamImage } from '../../../src/components/JamImage';

const mockJamImage = jest.mocked(JamImage);

jest.mock('../../../src/components/JamImage', () => require('../../../__mocks__/components/JamImage.tsx'));

jest.mock('../../../src/navigators/navigation', () => require('../../../__mocks__/navigators/navigation.ts'));

function makeEntry(overrides: Partial<HomeEntry> = {}): HomeEntry {
	return { id: 'a1', name: 'Abba', route: 'Artist', ...overrides };
}

describe('HomeSectionEntry', () => {
	it('shows the entry name and image', async () => {
		const screen = await render(<HomeSectionEntry entry={makeEntry({ id: 'a1', name: 'Abba' })} />);
		expect(screen.getByText('Abba')).toBeTruthy();
		expect(mockJamImage.mock.calls[0][0].id).toBe('a1');
	});

	it('navigates to the entry route with id and name when tapped', async () => {
		const screen = await render(<HomeSectionEntry entry={makeEntry({ id: 'a1', name: 'Abba', route: 'Artist' })} />);
		await fireEvent.press(screen.getByText('Abba'));
		expect(jest.mocked(NavigationService.navigate)).toHaveBeenCalledWith('Artist', { id: 'a1', name: 'Abba' });
	});
});
