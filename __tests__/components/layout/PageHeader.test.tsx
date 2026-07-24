import React from 'react';
import { Text } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PageHeader } from '../../../src/components/PageHeader';
import { NavigationService } from '../../../src/navigators/navigation';
import { ClickIcon } from '../../../src/components/ClickIcon';
import { ClickIconProps } from '../../helpers/test-types.ts';

jest.mock('../../../src/navigators/navigation', () => require('../../../__mocks__/navigators/navigation.ts'));

const mockClickIcon = jest.mocked(ClickIcon);

jest.mock('../../../src/components/ClickIcon', () => require('../../../__mocks__/components/ClickIcon.tsx'));

function icon(name: string): ClickIconProps | undefined {
	return mockClickIcon.mock.calls.map(call => call[0]).find(properties => properties.iconName === name);
}

describe('PageHeader', () => {
	it('renders the title', async () => {
		const screen = await render(<PageHeader title="Albums" />);
		expect(screen.getByText('Albums')).toBeTruthy();
	});

	it('renders the subtitle only when provided', async () => {
		const withSubtitle = await render(<PageHeader title="Albums" subtitle="All albums" />);
		expect(withSubtitle.getByText('All albums')).toBeTruthy();

		const withoutSubtitle = await render(<PageHeader title="Albums" />);
		expect(withoutSubtitle.queryByText('All albums')).toBeNull();
	});

	it('renders the nav icons only when goLeft/goRight are given', async () => {
		await render(<PageHeader title="Albums" />);
		expect(icon('left-open')).toBeUndefined();
		expect(icon('right-open')).toBeUndefined();

		jest.clearAllMocks();
		await render(<PageHeader title="Albums" goLeft={{ navig: { route: 'Prev' } } as never} goRight={{ navig: { route: 'Next' } } as never} />);
		expect(icon('left-open')).toBeDefined();
		expect(icon('right-open')).toBeDefined();
	});

	it('navigates via the goLeft/goRight links when the nav icons are pressed', async () => {
		const leftNavig = { route: 'Prev' };
		const rightNavig = { route: 'Next' };
		await render(<PageHeader title="Albums" goLeft={{ navig: leftNavig } as never} goRight={{ navig: rightNavig } as never} />);
		icon('left-open')!.onPress();
		icon('right-open')!.onPress();
		expect(jest.mocked(NavigationService.navigateTo)).toHaveBeenCalledWith(leftNavig);
		expect(jest.mocked(NavigationService.navigateTo)).toHaveBeenCalledWith(rightNavig);
	});

	it('renders the header command buttons when provided', async () => {
		const screen = await render(<PageHeader title="Albums" headerTitleCmds={<Text>CMD</Text>} />);
		expect(screen.getByText('CMD')).toBeTruthy();
	});
});
