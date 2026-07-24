import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { HomeMain } from '../../../src/components/HomeMain';
import cacheService from '../../../src/services/cache.service';
import { Stats } from '../../../src/components/Stats';
import { HomeDataSection } from '../../../src/components/HomeDataSection';
import { HomeUserSection } from '../../../src/components/HomeUserSection';
import { ErrorView } from '../../../src/components/ErrorView';
import { lastProps } from '../../../__mocks__/mock-props.ts';
import { useLazyHomeDataQuery } from '../../../src/services/queries/home';

const mockGetHomeData = jest.fn();
let mockHookState: { loading: boolean; error?: Error; called: boolean; homeData?: { stats?: unknown; homeData?: unknown; user?: unknown } };

jest.mock('../../../src/services/queries/home');
jest.mocked(useLazyHomeDataQuery).mockImplementation(() => [mockGetHomeData, mockHookState] as never);

jest.mock('../../../src/services/cache.service.ts', () => require('../../../__mocks__/services/cache.service.ts'));

interface ErrorViewProps {
	error: unknown;
	onRetry: () => void;
}

jest.mock('../../../src/components/ErrorView', () => require('../../../__mocks__/components/ErrorView.tsx'));

const mockStats = jest.mocked(Stats);
const mockDataSection = jest.mocked(HomeDataSection);
const mockUserSection = jest.mocked(HomeUserSection);

jest.mock('../../../src/components/Stats', () => require('../../../__mocks__/components/Stats.tsx'));
jest.mock('../../../src/components/HomeDataSection', () => require('../../../__mocks__/components/HomeDataSection.tsx'));
jest.mock('../../../src/components/HomeUserSection', () => require('../../../__mocks__/components/HomeUserSection.tsx'));
jest.mock('../../../src/components/HomeAppSection', () => require('../../../__mocks__/components/HomeAppSection.tsx'));

function hasRefreshControl(screen: Awaited<ReturnType<typeof render>>): boolean {
	return (screen.root?.queryAll(node => node.type === 'RCTRefreshControl').length ?? 0) > 0;
}

describe('HomeMain', () => {
	beforeEach(() => {
		mockHookState = { loading: false, called: false };
	});

	it('fetches home data on mount when not already called', async () => {
		await render(<HomeMain />);
		expect(mockGetHomeData).toHaveBeenCalled();
	});

	it('does not fetch again when it has already been called', async () => {
		mockHookState = { loading: false, called: true };
		await render(<HomeMain />);
		expect(mockGetHomeData).not.toHaveBeenCalled();
	});

	it('renders an error view wired to a forced reload', async () => {
		mockHookState = { loading: false, called: true, error: new Error('boom') };
		await render(<HomeMain />);
		expect(lastProps<ErrorViewProps>(ErrorView)?.error).toBeInstanceOf(Error);
		lastProps<ErrorViewProps>(ErrorView)?.onRetry();
		expect(mockGetHomeData).toHaveBeenCalledWith(true);
	});

	it('passes the stats, home data and user data to the sections', async () => {
		mockHookState = { loading: false, called: true, homeData: { stats: [{ x: 1 }], homeData: { a: 1 }, user: { u: 1 } } };
		await render(<HomeMain />);
		expect(mockStats.mock.calls[0][0].stats).toEqual([{ x: 1 }]);
		expect(mockDataSection.mock.calls[0][0].homeData).toEqual({ a: 1 });
		expect(mockUserSection.mock.calls[0][0].userData).toEqual({ u: 1 });
	});

	it('subscribes and unsubscribes to home-data cache updates', async () => {
		const screen = await render(<HomeMain />);
		expect(jest.mocked(cacheService.subscribeHomeDataChangeUpdates)).toHaveBeenCalledTimes(1);
		await screen.unmount();
		expect(jest.mocked(cacheService.unsubscribeHomeDataChangeUpdates)).toHaveBeenCalledTimes(1);
	});

	it('mounts a pull-to-refresh control', async () => {
		const screen = await render(<HomeMain />);
		expect(hasRefreshControl(screen)).toBe(true);
	});
});
