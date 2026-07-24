import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Stats } from '../../../src/components/Stats';
import { HomeStatData } from '../../../src/types/home-stats';
import { Stat } from '../../../src/components/Stat';

const mockStat = jest.mocked(Stat);

jest.mock('../../../src/components/Stat', () => require('../../../__mocks__/components/Stat.tsx'));

function makeStat(title: string, value: number): HomeStatData {
	return { value, link: { title, icon: 'artist', navig: { route: 'Artists' } } };
}

describe('Stats', () => {
	it('renders nothing when there are no stats', async () => {
		const screen = await render(<Stats label="Library" stats={[]} />);
		expect(screen.toJSON()).toBeNull();
		expect(mockStat).not.toHaveBeenCalled();
	});

	it('renders nothing when stats are undefined', async () => {
		const screen = await render(<Stats label="Library" />);
		expect(screen.toJSON()).toBeNull();
	});

	it('shows the section label', async () => {
		const screen = await render(<Stats label="Library" stats={[makeStat('Artists', 5)]} />);
		expect(screen.getByText('Library')).toBeTruthy();
	});

	it('renders one Stat per entry', async () => {
		await render(<Stats label="Library" stats={[makeStat('Artists', 5), makeStat('Albums', 9)]} />);
		expect(mockStat.mock.calls.map(call => call[0].stat.link.title)).toEqual(['Artists', 'Albums']);
	});
});
