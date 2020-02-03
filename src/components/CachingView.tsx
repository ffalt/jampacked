import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import ThemedText from './ThemedText';
import {Caching, CachingState} from '../services/caching';
import dataService from '../services/data';
import {staticTheme} from '../style/theming';

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	button: {
		marginLeft: staticTheme.marginSmall
	},
	text: {
		flex: 1
	}
});

const CachingView: React.FC<{ cache: Caching, title: string }> = ({cache, title}: { cache: Caching, title: string }) => {
	const [status, setStatus] = useState<CachingState>(cache.cachingData);

	useEffect(() => {
		const subscription = cache.cachingChange.subscribe(data => {
			setStatus({running: data.running, current: data.current});
		});
		return (): void => subscription.unsubscribe();
	}, [status, cache.cachingChange]);

	const start = (): void => {
		cache.startCaching();
	};

	const stop = (): void => {
		cache.stopCaching();
	};

	const clear = (): void => {
		dataService.clearCache()
			.catch(e => console.error(e));
	};

	if (!status.running) {
		return (
			<View style={styles.container}>
				<ThemedText style={styles.text}>{title}</ThemedText>
				<View style={styles.button}>
					<Button title="Optimize" onPress={start}/>
				</View>
				<View style={styles.button}>
					<Button title="Clear" onPress={clear}/>
				</View>
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<ThemedText style={styles.text}>{status.current}</ThemedText>
			<View style={styles.button}>
				<Button title="Stop" onPress={stop}/>
			</View>
		</View>
	);
};

export default CachingView;
