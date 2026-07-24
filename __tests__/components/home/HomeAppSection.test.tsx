import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { HomeAppSection } from '../../../src/components/HomeAppSection';
import { HomeStatData } from '../../../src/types/home-stats';
import { Stat } from '../../../src/components/Stat';
import { usePinnedCount } from '../../../src/services/pin.hooks';
import { allProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/components/Stat', () => require('../../../__mocks__/components/Stat.tsx'));
jest.mock('../../../src/services/pin.hooks.ts', () => require('../../../__mocks__/services/pin.hooks.ts'));

let mockPinnedCount = 0;

jest.mocked(usePinnedCount).mockImplementation(() => mockPinnedCount);

describe('HomeAppSection', () => {
	beforeEach(() => {
		mockPinnedCount = 0;
	});

	it('renders the Pinned label', async () => {
		const screen = await render(<HomeAppSection />);
		expect(screen.getByText('Pinned')).toBeTruthy();
	});

	it('renders a stat with the pinned count', async () => {
		mockPinnedCount = 5;
		await render(<HomeAppSection />);
		expect(allProps<{ stat: HomeStatData }>(Stat)[0].stat.value).toBe(5);
	});
});
