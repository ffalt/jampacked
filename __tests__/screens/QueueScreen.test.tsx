import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { QueueScreen } from '../../src/screens/QueueScreen';
import { PageHeader } from '../../src/components/PageHeader';
import { lastProps } from '../../__mocks__/mock-props.ts';
import { Queue } from '../../src/components/Queue';
import { screenProps } from '../../__mocks__/screen-props.ts';

interface HeaderProps {
	title: string;
}

const mockQueue = jest.mocked(Queue);

jest.mock('../../src/components/PageHeader', () => require('../../__mocks__/components/PageHeader.tsx'));

jest.mock('../../src/components/Queue', () => require('../../__mocks__/components/Queue.tsx'));

describe('QueueScreen', () => {
	it('renders the "Queue" page header', async () => {
		await render(<QueueScreen {...screenProps(QueueScreen)} />);
		expect(lastProps<HeaderProps>(PageHeader)?.title).toBe('Queue');
	});

	it('renders the Queue component', async () => {
		await render(<QueueScreen {...screenProps(QueueScreen)} />);
		expect(mockQueue).toHaveBeenCalledTimes(1);
	});
});
