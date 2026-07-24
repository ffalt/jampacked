import React from 'react';
import { Text } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';

interface ErrorViewProps {
	error: unknown;
	onRetry: () => void;
}

jest.mock('../../../src/components/ErrorView', () => require('../../../__mocks__/components/ErrorView.tsx'));

import { DefaultFlatList } from '../../../src/components/DefaultFlatList';
import { ErrorView } from '../../../src/components/ErrorView';
import { lastProps } from '../../../__mocks__/mock-props.ts';

interface Entry {
	id: string;
}

const renderItem = ({ item }: { item: Entry }): React.JSX.Element => (<Text>{item.id}</Text>);

function hasRefreshControl(screen: Awaited<ReturnType<typeof render>>): boolean {
	return screen.root!.queryAll(node => node.type === 'RCTRefreshControl').length > 0;
}

describe('DefaultFlatList', () => {
	it('renders an error view wired to reload when an error is present', async () => {
		const reload = jest.fn();
		await render(<DefaultFlatList items={[]} renderItem={renderItem} error={new Error('boom')} loading={false} reload={reload} />);
		expect(lastProps<ErrorViewProps>(ErrorView)?.error).toBeInstanceOf(Error);
		lastProps<ErrorViewProps>(ErrorView)?.onRetry();
		expect(reload).toHaveBeenCalledTimes(1);
	});

	it('renders the items when there is no error', async () => {
		const screen = await render(<DefaultFlatList items={[{ id: 'one' }, { id: 'two' }]} renderItem={renderItem} loading={false} reload={jest.fn()} />);
		expect(screen.getByText('one')).toBeTruthy();
		expect(screen.getByText('two')).toBeTruthy();
	});

	it('shows the empty placeholder when there are no items', async () => {
		const screen = await render(<DefaultFlatList items={[]} renderItem={renderItem} loading={false} reload={jest.fn()} />);
		expect(screen.getByText('No entries')).toBeTruthy();
	});

	it('shows the loading placeholder when items are undefined', async () => {
		const screen = await render(<DefaultFlatList renderItem={renderItem} loading={false} reload={jest.fn()} />);
		expect(screen.getByText('Loading')).toBeTruthy();
	});

	it('mounts a pull-to-refresh control on the list', async () => {
		const screen = await render(<DefaultFlatList items={[{ id: 'one' }]} renderItem={renderItem} loading={true} reload={jest.fn()} />);
		expect(hasRefreshControl(screen)).toBe(true);
	});

	it('renders the list header component', async () => {
		const screen = await render(<DefaultFlatList items={[{ id: 'one' }]} renderItem={renderItem} ListHeaderComponent={<Text>HEADER</Text>} loading={false} reload={jest.fn()} />);
		expect(screen.getByText('HEADER')).toBeTruthy();
	});
});
