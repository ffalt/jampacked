import React from 'react';
import { StyleSheet } from 'react-native';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { JamImage } from '../../../src/components/JamImage';
import { ImageFormatType } from '../../../src/services/jam';
import { mockAuth } from '../../../__mocks__/auth-mock.ts';
import { staticTheme } from '../../../src/style/theming';
import FastImage from '@d11/react-native-fast-image';
import { lastProps } from '../../../__mocks__/mock-props.ts';

jest.mock('../../../src/services/jam.auth.ts', () => require('../../../__mocks__/services/jam.auth.ts'));

const testStyles = StyleSheet.create({
	rounded: { borderRadius: 4 }
});

const mockImgSource = jest.mocked(mockAuth().imgSource);
const mockFastImage = jest.mocked(FastImage);

interface FastImageProps {
	source?: { uri: string };
	style?: unknown;
}

describe('JamImage', () => {
	beforeEach(() => {
		mockImgSource.mockReturnValue({ uri: 'http://x/a1' });
	});

	it('renders nothing when the image source has no uri', async () => {
		mockImgSource.mockReturnValue(undefined);
		const screen = await render(<JamImage id="a1" size={40} />);
		expect(screen.toJSON()).toBeNull();
		expect(mockFastImage).not.toHaveBeenCalled();
	});

	it('renders a FastImage with the resolved source', async () => {
		await render(<JamImage id="a1" size={40} />);
		expect(lastProps<FastImageProps>(FastImage)?.source).toEqual({ uri: 'http://x/a1' });
	});

	it('requests the webp format at the given request size', async () => {
		await render(<JamImage id="a1" requestSize={600} size={40} />);
		expect(mockImgSource).toHaveBeenCalledWith('a1', 600, ImageFormatType.webp);
	});

	it('falls back to the medium thumb size when no request size is given', async () => {
		await render(<JamImage id="a1" size={40} />);
		expect(mockImgSource).toHaveBeenCalledWith('a1', staticTheme.thumbMedium, ImageFormatType.webp);
	});

	it('applies the size and a custom style', async () => {
		await render(<JamImage id="a1" size={40} style={testStyles.rounded} />);
		const style = StyleSheet.flatten(lastProps<FastImageProps>(FastImage)?.style) as { width?: number; height?: number; borderRadius?: number };
		expect(style.width).toBe(40);
		expect(style.height).toBe(40);
		expect(style.borderRadius).toBe(4);
	});
});
