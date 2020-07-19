import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {ApolloError} from 'apollo-client';
import {useCallback, useEffect, useState} from 'react';
import {Jam} from '../jam';
import {WaveformResult, WaveformResultVariables} from './types/WaveformResult';

const GET_WAVEFORM = gql`
    query WaveformResult($id: ID!) {
        waveform(id:$id) {
            json
        }
    }
`;

export const transformData = (data?: WaveformResult): Jam.WaveFormData | undefined => {
	return data?.waveform?.json ? JSON.parse(data.waveform.json) : undefined;
};

export const useLazyWaveformQuery = (): [(id: string) => void,
	{ loading: boolean, error?: ApolloError, waveform?: Jam.WaveFormData, called: boolean }
] => {
	const [waveform, setWaveform] = useState<Jam.WaveFormData | undefined>(undefined);
	const [query, {loading, error, data, called}] = useLazyQuery<WaveformResult, WaveformResultVariables>(GET_WAVEFORM);

	useEffect(() => {
		setWaveform(transformData(data));
	}, [data]);

	const get = useCallback((id: string): void => {
		query({variables: {id}});
	}, [query]);

	return [
		get,
		{
			loading,
			called,
			error,
			waveform
		}
	];
};
