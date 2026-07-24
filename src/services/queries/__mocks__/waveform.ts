const actual = jest.requireActual<typeof import('../waveform')>('../waveform');

export const WaveformQuery = actual.WaveformQuery;
export const transformData = actual.transformData;
const mockGetWaveform = jest.fn();
export const useLazyWaveformQuery = jest.fn(() => [mockGetWaveform, { loading: false, called: false }]);
