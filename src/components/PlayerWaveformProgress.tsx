import React, { useEffect } from 'react';
import { WaveformProgress } from './WaveformProgress';
import { snackError } from '../utils/snack.ts';
import { StyleSheet, View } from 'react-native';
import { useLazyWaveformQuery } from '../services/queries/waveform';
import { useCurrentTrackID } from '../services/player.hooks.ts';

const styles = StyleSheet.create({
	container: {
		height: 50
	}
});

export const PlayerWaveformProgress: React.FC = () => {
	const id = useCurrentTrackID();
	const [getWaveform, { error, waveform }] = useLazyWaveformQuery();

	useEffect(() => {
		if (id) {
			getWaveform(id);
		}
	}, [getWaveform, id]);

	if (error) {
		snackError(error);
	}

	if (!waveform) {
		return (<View style={styles.container} />);
	}

	return (
		<WaveformProgress waveform={waveform} />
	);
};
