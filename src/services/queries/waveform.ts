import { Jam } from '../jam';
import { DocumentNode } from 'graphql';
import { ApolloError, useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { WaveformResultDocument, WaveformResultQuery, WaveformResultQueryVariables } from './waveform.api';

export const transformData = (data?: WaveformResultQuery): Jam.WaveFormData | undefined => {
	return data?.waveform?.json ? JSON.parse(data.waveform.json) : undefined;
};

function transformVariables(id: string): WaveformResultQueryVariables {
	return { id };
}

export const WaveformQuery: {
	query: DocumentNode;
	transformData: (d?: WaveformResultQuery, variables?: WaveformResultQueryVariables) => Jam.WaveFormData | undefined;
	transformVariables: (id: string) => WaveformResultQueryVariables;
} = { query: WaveformResultDocument, transformData, transformVariables };

export const useLazyWaveformQuery = (): [(id: string) => void,
	{ loading: boolean; error?: ApolloError; waveform?: Jam.WaveFormData; called: boolean }
] => {
	const [waveform, setWaveform] = useState<Jam.WaveFormData | undefined>(undefined);
	const [query, { loading, error, data, called }] = useLazyQuery<WaveformResultQuery, WaveformResultQueryVariables>(WaveformQuery.query);

	useEffect(() => {
		setWaveform(WaveformQuery.transformData(data));
	}, [data]);

	const get = useCallback((id: string): void => {
		query({ variables: WaveformQuery.transformVariables(id) });
	}, [query]);

	return [get, { loading, called, error, waveform }];
};
