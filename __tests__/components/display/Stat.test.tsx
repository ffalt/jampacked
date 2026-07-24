import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { Stat } from '../../../src/components/Stat';
import { HomeStatData } from '../../../src/types/home-stats';
import { render, fireEvent } from '@testing-library/react-native';

jest.mock('../../../src/navigators/navigation.ts', () => require('../../../__mocks__/navigators/navigation.ts'));

import { NavigationService } from '../../../src/navigators/navigation';

function makeStat(overrides: Partial<HomeStatData> = {}): HomeStatData {
	return {
		value: 42,
		link: { title: 'Artists', icon: 'artist', navig: { route: 'Artists' } },
		...overrides
	};
}

describe('Stat', () => {
	describe('rendering', () => {
		it('should display the value', async () => {
			const screen = await render(<Stat stat={makeStat({ value: 42 })} />);
			expect(screen.getByText('42')).toBeTruthy();
		});

		it('should display the link title as the label', async () => {
			const screen = await render(<Stat stat={makeStat()} />);
			expect(screen.getByText('Artists')).toBeTruthy();
		});

		it('should render large numbers without thousands formatting', async () => {
			const screen = await render(<Stat stat={makeStat({ value: 1_234_567 })} />);
			expect(screen.getByText('1234567')).toBeTruthy();
		});
	});

	describe('interactions', () => {
		it('should navigate to the stat link when pressed', async () => {
			const stat = makeStat();
			const screen = await render(<Stat stat={stat} />);

			await fireEvent.press(screen.getByText('Artists'));

			expect(NavigationService.navigateLink).toHaveBeenCalledWith(stat.link);
		});
	});
});
