import {ApolloError} from 'apollo-client';
import {Jam} from '../jam';
import {useCallback, useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {WaveformResult, WaveformResultVariables} from './types/WaveformResult';
import {WaveformQuery} from './waveform';

export const useLazyWaveformQuery = (): [(id: string) => void,
	{ loading: boolean, error?: ApolloError, waveform?: Jam.WaveFormData, called: boolean }
] => {
	const [waveform, setWaveform] = useState<Jam.WaveFormData | undefined>(undefined);
	const [query, {loading, error, data, called}] = useLazyQuery<WaveformResult, WaveformResultVariables>(WaveformQuery.query);

	useEffect(() => {
		setWaveform(WaveformQuery.transformData(data));
	}, [data]);

	const get = useCallback((id: string): void => {
		query({variables: WaveformQuery.transformVariables(id)});
	}, [query]);

	return [get, {loading, called, error, waveform}];
};
