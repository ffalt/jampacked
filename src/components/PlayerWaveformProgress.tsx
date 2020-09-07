import React, {useEffect} from 'react';
import {useCurrentTrackID} from '../services/player';
import {WaveformProgress} from './WaveformProgress';
import {useLazyWaveformQuery} from '../services/queries/waveform';
import {snackError} from '../services/snack';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
	container: {
		height: 50
	}
});

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
		return (<View style={styles.container}/>);
	}

	return (
		<WaveformProgress waveform={waveform}/>
	);
};
