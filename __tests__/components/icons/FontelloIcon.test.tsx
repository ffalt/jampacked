import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { StyleSheet } from 'react-native';
import { FontelloIcon } from '../../../src/components/FontelloIcon';
import { render } from '@testing-library/react-native';

const styles = StyleSheet.create({
	custom: { opacity: 0.5 }
});

describe('FontelloIcon', () => {
	it('should render without crashing', async () => {
		const screen = await render(<FontelloIcon name="play" />);
		expect(screen.toJSON()).toBeDefined();
	});

	it('should forward the name prop', async () => {
		const screen = await render(<FontelloIcon name="pause" />);
		expect(screen.root?.props.name).toBe('pause');
	});

	it('should forward the color prop', async () => {
		const screen = await render(<FontelloIcon name="play" color="red" />);
		expect(screen.root?.props.color).toBe('red');
	});

	it('should forward the size prop', async () => {
		const screen = await render(<FontelloIcon name="play" size={30} />);
		expect(screen.root?.props.size).toBe(30);
	});

	it('should forward a custom style', async () => {
		const screen = await render(<FontelloIcon name="play" style={styles.custom} />);
		expect((screen.root?.props.style as { opacity?: number }).opacity).toBe(0.5);
	});
});
