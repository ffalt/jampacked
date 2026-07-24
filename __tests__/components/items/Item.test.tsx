import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { Item } from '../../../src/components/Item';
import { BaseEntry } from '../../../src/types/base';
import { JamObjectType } from '../../../src/services/jam';
import { NavigationService } from '../../../src/navigators/navigation';
import { JamImage } from '../../../src/components/JamImage';

const mockJamImage = jest.mocked(JamImage);

jest.mock('../../../src/components/JamImage', () => require('../../../__mocks__/components/JamImage.tsx'));

jest.mock('../../../src/navigators/navigation', () => require('../../../__mocks__/navigators/navigation.ts'));

function makeEntry(overrides: Partial<BaseEntry> = {}): BaseEntry {
	return { id: 'a1', title: 'Abba', desc: 'Swedish pop', objType: JamObjectType.artist, ...overrides };
}

describe('Item', () => {
	it('shows the title and description', async () => {
		const screen = await render(<Item item={makeEntry()} />);
		expect(screen.getByText('Abba')).toBeTruthy();
		expect(screen.getByText('Swedish pop')).toBeTruthy();
	});

	it('passes the entry id to the image', async () => {
		await render(<Item item={makeEntry({ id: 'a1' })} />);
		expect(mockJamImage.mock.calls[0][0].id).toBe('a1');
	});

	it('navigates to the entry when pressed', async () => {
		const screen = await render(<Item item={makeEntry({ id: 'a1', title: 'Abba', objType: JamObjectType.artist })} />);
		await fireEvent.press(screen.getByText('Abba'));
		expect(jest.mocked(NavigationService.navigateObj)).toHaveBeenCalledWith(JamObjectType.artist, 'a1', 'Abba');
	});
});
