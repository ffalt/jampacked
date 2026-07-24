import 'react-native';
import React from 'react';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { PlayerWaveformProgress } from '../../../src/components/PlayerWaveformProgress';
import { Jam } from '../../../src/services/jam';
import { snackError } from '../../../src/utils/snack';
import { useTrackPlayerCurrentTrackID } from 'react-native-track-player';
import { WaveformProgress } from '../../../src/components/WaveformProgress';
import { useLazyWaveformQuery } from '../../../src/services/queries/waveform';

jest.mock('../../../src/utils/snack', () => require('../../../__mocks__/utils/snack.ts'));

const mockWaveformProgress = jest.mocked(WaveformProgress);

jest.mock('../../../src/components/WaveformProgress', () => require('../../../__mocks__/components/WaveformProgress.tsx'));

const mockGetWaveform = jest.fn();
let mockHookState: { error?: Error; waveform?: Jam.WaveFormData };

jest.mock('../../../src/services/queries/waveform');
jest.mocked(useLazyWaveformQuery).mockImplementation(() => [mockGetWaveform, mockHookState] as never);

let mockTrackID: string | undefined;

jest.mocked(useTrackPlayerCurrentTrackID).mockImplementation(() => mockTrackID);

const waveform: Jam.WaveFormData = { version: 2, channels: 1, sample_rate: 44_100, samples_per_pixel: 256, bits: 8, length: 1, data: [-10, 20] };

describe('PlayerWaveformProgress', () => {
	beforeEach(() => {
		mockTrackID = 't1';
		mockHookState = {};
	});

	it('fetches the waveform for the current track id', async () => {
		await render(<PlayerWaveformProgress />);
		expect(mockGetWaveform).toHaveBeenCalledWith('t1');
	});

	it('renders an empty placeholder while there is no waveform', async () => {
		mockHookState = {};
		await render(<PlayerWaveformProgress />);
		expect(mockWaveformProgress).not.toHaveBeenCalled();
	});

	it('renders the waveform progress once loaded', async () => {
		mockHookState = { waveform };
		await render(<PlayerWaveformProgress />);
		expect(mockWaveformProgress.mock.calls[0][0].waveform).toBe(waveform);
	});

	it('surfaces a fetch error via snackError', async () => {
		mockHookState = { error: new Error('no network') };
		await render(<PlayerWaveformProgress />);
		expect(jest.mocked(snackError)).toHaveBeenCalledWith(mockHookState.error);
	});
});
