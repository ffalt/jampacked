import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeSection } from '../../../src/components/HomeSection';
import { HomeEntry } from '../../../src/types/home';
import { NavigationService } from '../../../src/navigators/navigation';
import { HomeSectionEntry } from '../../../src/components/HomeSectionEntry';

jest.mock('../../../src/components/ThemedIcon', () => require('../../../__mocks__/components/ThemedIcon.tsx'));

const mockEntry = jest.mocked(HomeSectionEntry);

jest.mock('../../../src/components/HomeSectionEntry', () => require('../../../__mocks__/components/HomeSectionEntry.tsx'));

jest.mock('../../../src/navigators/navigation', () => require('../../../__mocks__/navigators/navigation.ts'));

function makeEntry(id: string): HomeEntry {
	return { id, name: `Name ${id}`, route: 'Artist' };
}

describe('HomeSection', () => {
	it('renders nothing when the section is empty', async () => {
		const screen = await render(<HomeSection title="Recent" section={[]} />);
		expect(screen.toJSON()).toBeNull();
		expect(mockEntry).not.toHaveBeenCalled();
	});

	it('renders nothing when the section is undefined', async () => {
		const screen = await render(<HomeSection title="Recent" />);
		expect(screen.toJSON()).toBeNull();
	});

	it('renders the title and one entry per item', async () => {
		const screen = await render(<HomeSection title="Recent" section={[makeEntry('1'), makeEntry('2')]} />);
		expect(screen.getByText('Recent')).toBeTruthy();
		expect(mockEntry.mock.calls.map(call => call[0].entry.id)).toEqual(['1', '2']);
	});

	it('navigates to the section route when the header is tapped', async () => {
		const screen = await render(<HomeSection title="Recent" section={[makeEntry('1')]} sectionNavig={{ route: 'Albums', params: { albumType: undefined } }} />);
		await fireEvent.press(screen.getByText('Recent'));
		expect(jest.mocked(NavigationService.navigate)).toHaveBeenCalledWith('Albums', { albumType: undefined });
	});

	it('does not navigate when no section nav target is given', async () => {
		const screen = await render(<HomeSection title="Recent" section={[makeEntry('1')]} />);
		await fireEvent.press(screen.getByText('Recent'));
		expect(jest.mocked(NavigationService.navigate)).not.toHaveBeenCalled();
	});
});
