import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { MiniProgressBar } from '../../../src/components/PlayerProgressMini';
import { useTrackPlayerProgressPercent } from 'react-native-track-player';

let mockProgress = 0;

jest.mocked(useTrackPlayerProgressPercent).mockImplementation((() => ({ progress: mockProgress })) as never);

interface HostNode {
	type: string;
	props: Record<string, any>;
}

function filledBar(screen: Awaited<ReturnType<typeof render>>): { width?: string; backgroundColor?: string } {
	const views = screen.root!.queryAll(node => (node as unknown as HostNode).type === 'View') as unknown as Array<HostNode>;
	const filled = views.find(view => {
		const style = StyleSheet.flatten(view.props.style) as { width?: string };
		return style.width !== undefined;
	});
	return StyleSheet.flatten(filled!.props.style) as { width?: string; backgroundColor?: string };
}

describe('MiniProgressBar', () => {
	beforeEach(() => {
		mockProgress = 0;
	});

	it('sets the fill width to the progress percentage', async () => {
		mockProgress = 0.25;
		const screen = await render(<MiniProgressBar />);
		expect(filledBar(screen).width).toBe('25%');
	});

	it('shows a 0% fill at the start', async () => {
		mockProgress = 0;
		const screen = await render(<MiniProgressBar />);
		expect(filledBar(screen).width).toBe('0%');
	});

	it('shows a 100% fill when complete', async () => {
		mockProgress = 1;
		const screen = await render(<MiniProgressBar />);
		expect(filledBar(screen).width).toBe('100%');
	});

	it('uses the theme progress colour for the fill', async () => {
		mockProgress = 0.5;
		const screen = await render(<MiniProgressBar />);
		expect(filledBar(screen).backgroundColor).toBe('#6c6c6e');
	});
});
