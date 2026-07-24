import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { AtoZPicker } from '../../../src/components/AtoZPicker';
import { AtoZLetter } from '../../../src/components/AtoZLetter';

const mockAtoZLetter = jest.mocked(AtoZLetter);

jest.mock('../../../src/components/AtoZLetter', () => require('../../../__mocks__/components/AtoZLetter.tsx'));

function renderedLetters(): Array<{ letter: string; active: boolean }> {
	return mockAtoZLetter.mock.calls.map(call => call[0]);
}

describe('AtoZPicker', () => {
	it('renders nothing when there are no letters', async () => {
		const screen = await render(<AtoZPicker letters={[]} />);
		expect(screen.toJSON()).toBeNull();
		expect(mockAtoZLetter).not.toHaveBeenCalled();
	});

	it('renders a letter entry for each provided letter', async () => {
		await render(<AtoZPicker letters={['A', 'B', 'C']} />);
		expect(renderedLetters().map(entry => entry.letter)).toEqual(['A', 'B', 'C']);
	});

	it('marks the active letter as active and the others inactive', async () => {
		await render(<AtoZPicker letters={['A', 'B', 'C']} activeLetter="B" />);
		const byLetter = new Map(renderedLetters().map(entry => [entry.letter, entry.active]));
		expect(byLetter.get('A')).toBe(false);
		expect(byLetter.get('B')).toBe(true);
		expect(byLetter.get('C')).toBe(false);
	});
});
