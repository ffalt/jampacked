import React from 'react';
import { StyleSheet } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import { ImageItem } from '../../../src/components/ImageItem';
import { BaseEntry } from '../../../src/types/base';
import { JamObjectType } from '../../../src/services/jam';
import { NavigationService } from '../../../src/navigators/navigation';
import { mockAuth } from '../../../__mocks__/auth-mock.ts';
import FastImage from '@d11/react-native-fast-image';
import { lastProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/navigators/navigation', () => require('../../../__mocks__/navigators/navigation.ts'));
jest.mock('../../../src/services/jam.auth.ts', () => require('../../../__mocks__/services/jam.auth.ts'));

const mockImgSource = jest.mocked(mockAuth().imgSource);
const mockFastImage = jest.mocked(FastImage);

interface FastImageProps {
	source?: { uri: string };
}

function makeEntry(overrides: Partial<BaseEntry> = {}): BaseEntry {
	return { id: 'a1', title: 'Abba', desc: 'desc', objType: JamObjectType.album, ...overrides };
}

describe('ImageItem', () => {
	beforeEach(() => {
		mockImgSource.mockReturnValue({ uri: 'http://x/a1' });
	});

	it('renders nothing when the image source has no uri', async () => {
		mockImgSource.mockReturnValue(undefined);
		const screen = await render(<ImageItem item={makeEntry()} size={100} />);
		expect(screen.toJSON()).toBeNull();
		expect(mockFastImage).not.toHaveBeenCalled();
	});

	it('renders the image with the resolved source', async () => {
		const screen = await render(<ImageItem item={makeEntry()} size={100} />);
		expect(lastProps<FastImageProps>(FastImage)?.source).toEqual({ uri: 'http://x/a1' });
		expect(screen.toJSON()).not.toBeNull();
	});

	it('sizes the tile as a square from the size prop', async () => {
		const screen = await render(<ImageItem item={makeEntry()} size={120} />);
		const style = StyleSheet.flatten(screen.root!.props.style) as { width?: number; height?: number };
		expect(style.width).toBe(120);
		expect(style.height).toBe(120);
	});

	it('navigates to the entry when pressed', async () => {
		const screen = await render(<ImageItem item={makeEntry({ id: 'a1', title: 'Abba', objType: JamObjectType.album })} size={100} />);
		await fireEvent.press(screen.root!);
		expect(jest.mocked(NavigationService.navigateObj)).toHaveBeenCalledWith(JamObjectType.album, 'a1', 'Abba');
	});
});
