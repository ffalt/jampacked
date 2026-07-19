import 'react-native';
import React from 'react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { ErrorView } from '../../../src/components/ErrorView';
import { errorMessage } from '../../../src/utils/errors.utils.ts';
import { render, fireEvent } from '@testing-library/react-native';
import { hasNodeOfType } from '../../helpers/tree';

jest.mock('../../../src/style/theming', () => ({
	useTheme: () => ({ textColor: '#000000' }),
	staticTheme: { margin: 10, paddingLarge: 16 }
}));

jest.mock('../../../src/utils/snack.ts', () => ({
	snackError: jest.fn(),
	snackSuccess: jest.fn()
}));

import { snackError } from '../../../src/utils/snack.ts';

describe('ErrorView', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('rendering', () => {
		it('should display the error message', async () => {
			const screen = await render(<ErrorView error="Something went wrong" onRetry={jest.fn()} />);
			expect(screen.getByText('Something went wrong')).toBeTruthy();
		});

		it('should display the message from an Error object', async () => {
			const screen = await render(<ErrorView error={new Error('Network error')} onRetry={jest.fn()} />);
			expect(screen.getByText('Network error')).toBeTruthy();
		});

		it('should show the error icon', async () => {
			const screen = await render(<ErrorView error="boom" onRetry={jest.fn()} />);
			expect(hasNodeOfType(screen.toJSON(), 'Image')).toBe(true);
		});

		it('should show the retry button', async () => {
			const screen = await render(<ErrorView error="boom" onRetry={jest.fn()} />);
			expect(screen.getByText('Retry')).toBeTruthy();
		});
	});

	describe('interactions', () => {
		it('should call onRetry when the retry button is pressed', async () => {
			const onRetry = jest.fn();
			const screen = await render(<ErrorView error="boom" onRetry={onRetry} />);

			await fireEvent.press(screen.getByText('Retry'));

			expect(onRetry).toHaveBeenCalledTimes(1);
		});
	});

	describe('error handling', () => {
		it('should show a snack notification with the error on mount', async () => {
			const error = 'Test error';
			await render(<ErrorView error={error} onRetry={jest.fn()} />);
			expect(snackError).toHaveBeenCalledWith(error);
		});

		it('should format the error via errorMessage (strips leading "Error:")', async () => {
			const screen = await render(<ErrorView error={new Error('Error: prefixed')} onRetry={jest.fn()} />);
			expect(errorMessage(new Error('Error: prefixed'))).toBe('prefixed');
			expect(screen.getByText('prefixed')).toBeTruthy();
		});
	});
});
