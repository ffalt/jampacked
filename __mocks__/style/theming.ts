import type { ITheme, ThemeSettings } from '../../src/style/theming.ts';

const actual = jest.requireActual<typeof import('../../src/style/theming.ts')>('../../src/style/theming.ts');

/**
 * The theme every test sees. These are the real `light` theme values, so
 * assertions on colours stay meaningful instead of checking invented hex codes.
 * Import it (and `staticTheme`) rather than hard-coding colours in a test.
 */
export const mockTheme: ITheme = actual.getTheme('light');

export const staticTheme = actual.staticTheme;
export const themeList = actual.themeList;
export const getTheme = jest.fn(() => mockTheme);
export const getAutoTheme = jest.fn(() => mockTheme);
export const ThemeContext = actual.ThemeContext;
export const ThemeProvider = actual.ThemeProvider;

export const useTheme = jest.fn((): ITheme => mockTheme);

export const mockSetTheme = jest.fn(async (): Promise<void> => undefined);
export const mockLoadUserTheme = jest.fn(async (): Promise<void> => undefined);

export const useThemeContext = jest.fn((): ThemeSettings => ({
	theme: mockTheme,
	setTheme: mockSetTheme,
	loadUserTheme: mockLoadUserTheme
}));
