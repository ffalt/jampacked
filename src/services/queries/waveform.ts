import gql from 'graphql-tag';
import {Jam} from '../jam';
import {WaveformResult, WaveformResultVariables} from './types/WaveformResult';
import {DocumentNode} from 'graphql';

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

function transformVariables(id: string): WaveformResultVariables {
	return {id};
}

export const WaveformQuery: {
	query: DocumentNode;
	transformData: (d?: WaveformResult, variables?: WaveformResultVariables) => Jam.WaveFormData | undefined;
	transformVariables: (id: string) => WaveformResultVariables;
} = {query: GET_WAVEFORM, transformData, transformVariables};
