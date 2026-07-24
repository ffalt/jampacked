import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { FastImageBackground } from '../../../src/components/JamBackgroundImage';
import { mockAuth } from '../../../__mocks__/auth-mock.ts';
import FastImage from '@d11/react-native-fast-image';
import { lastProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/services/jam.auth.ts', () => require('../../../__mocks__/services/jam.auth.ts'));

const testStyles = StyleSheet.create({
	box: { width: 100, height: 100 }
});

const mockImgSource = jest.mocked(mockAuth().imgSource);
const mockFastImage = jest.mocked(FastImage);

interface FastImageProps {
	source?: { uri: string };
}

describe('FastImageBackground', () => {
	beforeEach(() => {
		mockImgSource.mockReturnValue({ uri: 'http://x/a1' });
	});

	it('renders its children', async () => {
		const screen = await render(<FastImageBackground id="a1" style={testStyles.box}><Text>CHILD</Text></FastImageBackground>);
		expect(screen.getByText('CHILD')).toBeTruthy();
	});

	it('renders the background image when the id resolves to a source', async () => {
		await render(<FastImageBackground id="a1" style={testStyles.box}><Text>CHILD</Text></FastImageBackground>);
		expect(lastProps<FastImageProps>(FastImage)?.source).toEqual({ uri: 'http://x/a1' });
	});

	it('renders no background image when there is no source uri', async () => {
		mockImgSource.mockReturnValue(undefined);
		const screen = await render(<FastImageBackground id="a1" style={testStyles.box}><Text>CHILD</Text></FastImageBackground>);
		expect(mockFastImage).not.toHaveBeenCalled();
		expect(screen.getByText('CHILD')).toBeTruthy();
	});
});
