import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { staticTheme } from '../../src/style/theming';

import { PlayerTabs } from '../../src/components/PlayerTabs';
import { PlayerTrack } from '../../src/components/PlayerTrack';
import { PlayerWaveformProgress } from '../../src/components/PlayerWaveformProgress';
import { PlayerProgress } from '../../src/components/PlayerProgress';
import { PlayerTime } from '../../src/components/PlayerTime';
import { PlayerControl } from '../../src/components/PlayerControl';
import { PlayerAnnotation } from '../../src/components/PlayerAnnotation';

jest.mock('../../src/components/PlayerTabs', () => require('../../__mocks__/components/PlayerTabs.tsx'));
jest.mock('../../src/components/PlayerTrack', () => require('../../__mocks__/components/PlayerTrack.tsx'));
jest.mock('../../src/components/PlayerWaveformProgress', () => require('../../__mocks__/components/PlayerWaveformProgress.tsx'));
jest.mock('../../src/components/PlayerProgress', () => require('../../__mocks__/components/PlayerProgress.tsx'));
jest.mock('../../src/components/PlayerTime', () => require('../../__mocks__/components/PlayerTime.tsx'));
jest.mock('../../src/components/PlayerControl', () => require('../../__mocks__/components/PlayerControl.tsx'));
jest.mock('../../src/components/PlayerAnnotation', () => require('../../__mocks__/components/PlayerAnnotation.tsx'));

const mockTabs = jest.mocked(PlayerTabs);
const mockTrack = jest.mocked(PlayerTrack);
const mockWaveform = jest.mocked(PlayerWaveformProgress);
const mockProgress = jest.mocked(PlayerProgress);
const mockTime = jest.mocked(PlayerTime);
const mockControl = jest.mocked(PlayerControl);
const mockAnnotation = jest.mocked(PlayerAnnotation);

function loadScreen(os: 'ios' | 'android'): { Screen: React.FC; flatten: (style: unknown) => Record<string, unknown> } {
	let Screen: React.FC = () => null;
	let flatten: (style: unknown) => Record<string, unknown> = () => ({});
	jest.isolateModules(() => {
		const RN = require('react-native') as typeof import('react-native');
		(RN.Platform as { OS: string }).OS = os;
		flatten = RN.StyleSheet.flatten as unknown as (style: unknown) => Record<string, unknown>;
		const module_ = require('../../src/screens/PlayerScreen') as { PlayerScreen: React.FC };
		Screen = module_.PlayerScreen;
	});
	return { Screen, flatten };
}

describe('PlayerScreen', () => {
	it('renders the player sub-components (Tabs, Track, Waveform, Progress, Time, Control, Annotation)', async () => {
		const { Screen } = loadScreen('ios');
		await render(<Screen />);
		expect(mockTabs).toHaveBeenCalledTimes(1);
		expect(mockTrack).toHaveBeenCalledTimes(1);
		expect(mockWaveform).toHaveBeenCalledTimes(1);
		expect(mockProgress).toHaveBeenCalledTimes(1);
		expect(mockTime).toHaveBeenCalledTimes(1);
		expect(mockControl).toHaveBeenCalledTimes(1);
		expect(mockAnnotation).toHaveBeenCalledTimes(1);
	});

	it('applies platform-specific padding', async () => {
		const ios = loadScreen('ios');
		const iosScreen = await render(<ios.Screen />);
		const iosStyle = ios.flatten(iosScreen.toJSON()?.props.style);
		expect(iosStyle.paddingTop).toBe(staticTheme.paddingLarge);
		expect(iosStyle.paddingBottom).toBe(staticTheme.paddingLarge * 2);

		const android = loadScreen('android');
		const androidScreen = await render(<android.Screen />);
		const androidStyle = android.flatten(androidScreen.toJSON()?.props.style);
		expect(androidStyle.paddingTop).toBe(0);
		expect(androidStyle.paddingBottom).toBe(staticTheme.paddingLarge);
	});
});
