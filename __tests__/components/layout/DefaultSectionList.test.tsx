import React from 'react';
import { Text } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';

interface ErrorViewProps {
	error: unknown;
	onRetry: () => void;
}

jest.mock('../../../src/components/ErrorView', () => require('../../../__mocks__/components/ErrorView.tsx'));

import { DefaultSectionList } from '../../../src/components/DefaultSectionList';
import { ErrorView } from '../../../src/components/ErrorView';
import { lastProps } from '../../../__mocks__/mock-props.ts';

interface Entry {
	id: string;
}

interface Section {
	title: string;
	data: Array<Entry>;
}

const renderItem = ({ item }: { item: Entry }): React.JSX.Element => (<Text>{item.id}</Text>);
const renderSectionHeader = ({ section }: { section: { title: string } }): React.JSX.Element => (<Text>{section.title}</Text>);

function hasRefreshControl(screen: Awaited<ReturnType<typeof render>>): boolean {
	return screen.root!.queryAll(node => node.type === 'RCTRefreshControl').length > 0;
}

const sections: Array<Section> = [{ title: 'Artists', data: [{ id: 'one' }, { id: 'two' }] }];

describe('DefaultSectionList', () => {
	it('renders an error view wired to reload when an error is present', async () => {
		const reload = jest.fn();
		await render(<DefaultSectionList sections={[]} renderItem={renderItem} error={new Error('boom')} loading={false} reload={reload} />);
		expect(lastProps<ErrorViewProps>(ErrorView)?.error).toBeInstanceOf(Error);
		lastProps<ErrorViewProps>(ErrorView)?.onRetry();
		expect(reload).toHaveBeenCalledTimes(1);
	});

	it('renders the section items and headers when there is no error', async () => {
		const screen = await render(<DefaultSectionList sections={sections} renderItem={renderItem} renderSectionHeader={renderSectionHeader} loading={false} reload={jest.fn()} />);
		expect(screen.getByText('Artists')).toBeTruthy();
		expect(screen.getByText('one')).toBeTruthy();
		expect(screen.getByText('two')).toBeTruthy();
	});

	it('shows the empty placeholder when there are no sections', async () => {
		const screen = await render(<DefaultSectionList sections={[]} renderItem={renderItem} loading={false} reload={jest.fn()} />);
		expect(screen.getByText('No entries')).toBeTruthy();
	});

	it('mounts a pull-to-refresh control on the list', async () => {
		const screen = await render(<DefaultSectionList sections={sections} renderItem={renderItem} loading={true} reload={jest.fn()} />);
		expect(hasRefreshControl(screen)).toBe(true);
	});
});
