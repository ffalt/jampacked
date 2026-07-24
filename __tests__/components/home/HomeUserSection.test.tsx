import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { HomeUserSection } from '../../../src/components/HomeUserSection';
import { HomeStatData } from '../../../src/types/home-stats';
import { UserDataResult } from '../../../src/services/queries/home';
import { Stats } from '../../../src/components/Stats';

const mockStats = jest.mocked(Stats);

jest.mock('../../../src/components/Stats', () => require('../../../__mocks__/components/Stats.tsx'));

function makeStat(title: string): HomeStatData {
	return { value: 1, link: { title, icon: 'artist', navig: { route: 'Artists' } } };
}

describe('HomeUserSection', () => {
	it('renders nothing when there is no user data', async () => {
		const screen = await render(<HomeUserSection />);
		expect(screen.toJSON()).toBeNull();
		expect(mockStats).not.toHaveBeenCalled();
	});

	it('renders the Collections, Favorites and Played stats when present', async () => {
		const userData: UserDataResult = {
			stats: [makeStat('Artists')],
			favorites: [makeStat('Faved')],
			played: [makeStat('Played')]
		};
		await render(<HomeUserSection userData={userData} />);
		expect(mockStats.mock.calls.map(call => call[0].label)).toEqual(['Collections', 'Favorites', 'Played']);
	});

	it('omits a stats block when its data is missing', async () => {
		const userData = { stats: [makeStat('Artists')] } as unknown as UserDataResult;
		await render(<HomeUserSection userData={userData} />);
		expect(mockStats.mock.calls.map(call => call[0].label)).toEqual(['Collections']);
	});
});
