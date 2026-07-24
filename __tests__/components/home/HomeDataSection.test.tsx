import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { HomeDataSection } from '../../../src/components/HomeDataSection';
import { HomeData, HomeEntry } from '../../../src/types/home';
import { HomeSection } from '../../../src/components/HomeSection';

const mockSection = jest.mocked(HomeSection);

jest.mock('../../../src/components/HomeSection', () => require('../../../__mocks__/components/HomeSection.tsx'));

function makeEntry(id: string): HomeEntry {
	return { id, name: `Name ${id}`, route: 'Artist' };
}

describe('HomeDataSection', () => {
	it('renders nothing when there is no home data', async () => {
		const screen = await render(<HomeDataSection />);
		expect(screen.toJSON()).toBeNull();
		expect(mockSection).not.toHaveBeenCalled();
	});

	it('renders the four sections with their titles when data is present', async () => {
		const homeData: HomeData = {
			albumsRecent: [makeEntry('1')],
			artistsRecent: [makeEntry('2')],
			albumsFaved: [makeEntry('3')],
			artistsFaved: [makeEntry('4')]
		};
		await render(<HomeDataSection homeData={homeData} />);
		expect(mockSection.mock.calls.map(call => call[0].title)).toEqual([
			'Recently Played Albums',
			'Recently Played Artists',
			'Favorite Albums',
			'Favorite Artists'
		]);
	});

	it('passes each section its entries', async () => {
		const homeData: HomeData = { albumsRecent: [makeEntry('1'), makeEntry('9')] };
		await render(<HomeDataSection homeData={homeData} />);
		const recentAlbums = mockSection.mock.calls.map(call => call[0]).find(properties => properties.title === 'Recently Played Albums');
		expect(recentAlbums?.section).toEqual(homeData.albumsRecent);
		expect(recentAlbums?.sectionNavig?.route).toBeDefined();
	});
});
