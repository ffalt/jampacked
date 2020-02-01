import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import ThemedText from './ThemedText';
import dataService, {CachingState} from '../services/data';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	text: {
		flex: 1
	}
});

const CachingView: React.FC = () => {
	const [status, setStatus] = useState<CachingState>(dataService.caching);

	useEffect(() => {
		const subscription = dataService.cachingChange.subscribe(data => {
			setStatus({running: data.running, current: data.current});
		});
		return (): void => subscription.unsubscribe();
	}, [status]);

	const start = (): void => {
		dataService.startCaching();
	};

	const stop = (): void => {
		dataService.stopCaching();
	};

	if (!status.running) {
		return (
			<View style={styles.container}>
				<ThemedText style={styles.text}>Data Cache</ThemedText>
				<Button title="Optimize" onPress={start}/>
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<ThemedText style={styles.text}>{status.current}</ThemedText>
			<Button title="Stop" onPress={stop}/>
		</View>
	);
};

export default CachingView;
