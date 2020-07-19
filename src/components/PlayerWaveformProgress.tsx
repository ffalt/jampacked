import React, {useEffect} from 'react';
import {useCurrentTrackID} from '../services/player';
import {WaveformProgress} from './WaveformProgress';
import {useLazyWaveformQuery} from '../services/queries/waveform';
import {snackError} from '../services/snack';

export const PlayerWaveformProgress: React.FC = () => {
	const id = useCurrentTrackID();
	const [getWaveform, {error, waveform}] = useLazyWaveformQuery();

	useEffect(() => {
		if (id) {
			getWaveform(id);
		}
	}, [getWaveform, id]);

	if (error) {
		snackError(error);
	}

	if (!waveform) {
		return (<></>);
	}

	return (
		<WaveformProgress waveform={waveform}/>
	);
};
