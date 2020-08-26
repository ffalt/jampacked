import React, {useEffect} from 'react';
import {useCurrentTrackID} from '../services/player';
import {WaveformProgress} from './WaveformProgress';
import {useLazyWaveformQuery} from '../services/queries/waveform';
import {snackError} from '../services/snack';
import {View} from 'react-native';

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
		return (<View style={{height: 50}}/>);
	}

	return (
		<WaveformProgress waveform={waveform}/>
	);
};
