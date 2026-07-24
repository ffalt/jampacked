import React from 'react';
import { Text } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { ObjectHeader, HeaderDetail } from '../../../src/components/ObjectHeader';
import { JamImage } from '../../../src/components/JamImage';

jest.mock('../../../src/components/JamBackgroundImage', () => require('../../../__mocks__/components/JamBackgroundImage.tsx'));

const mockJamImage = jest.mocked(JamImage);

jest.mock('../../../src/components/JamImage', () => require('../../../__mocks__/components/JamImage.tsx'));

describe('ObjectHeader', () => {
	it('shows the title and the type name', async () => {
		const screen = await render(<ObjectHeader id="a1" title="Abba" typeName="Artist" />);
		expect(screen.getByText('Abba')).toBeTruthy();
		expect(screen.getByText('Artist')).toBeTruthy();
	});

	it('renders the header image for the id', async () => {
		await render(<ObjectHeader id="a1" title="Abba" />);
		expect(mockJamImage.mock.calls[0][0].id).toBe('a1');
	});

	it('renders the detail rows', async () => {
		const details: Array<HeaderDetail> = [{ title: 'Tracks', value: '12' }, { title: 'Year', value: '1979' }];
		const screen = await render(<ObjectHeader id="a1" title="Abba" details={details} />);
		expect(screen.getByText('Tracks')).toBeTruthy();
		expect(screen.getByText('12')).toBeTruthy();
		expect(screen.getByText('Year')).toBeTruthy();
	});

	it('calls a detail row click handler when the row is pressed', async () => {
		const click = jest.fn();
		const screen = await render(<ObjectHeader id="a1" title="Abba" details={[{ title: 'Genre', value: 'Pop', click }]} />);
		await fireEvent.press(screen.getByText('Genre'));
		expect(click).toHaveBeenCalledTimes(1);
	});

	it('renders the header command buttons when provided', async () => {
		const screen = await render(<ObjectHeader id="a1" title="Abba" headerTitleCmds={<Text>CMD</Text>} />);
		expect(screen.getByText('CMD')).toBeTruthy();
	});
});
