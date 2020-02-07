import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Button, StyleSheet, View} from 'react-native';
import ThemedText from './ThemedText';
import {Caching, CachingState} from '../services/caching';
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
		paddingLeft: staticTheme.paddingSmall,
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

	const startCaching = (): void => {
		cache.startCaching();
	};

	const stop = (): void => {
		cache.stop();
	};

	const startClearingCache = (): void => {
		cache.startClearing();
	};

	if (!status.running) {
		return (
			<View style={styles.container}>
				<ThemedText style={styles.text}>{title}</ThemedText>
				<View style={styles.button}>
					<Button title="Optimize" onPress={startCaching}/>
				</View>
				<View style={styles.button}>
					<Button title="Clear" onPress={startClearingCache}/>
				</View>
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<ActivityIndicator size="small"/>
			<ThemedText style={styles.text}>{status.current}</ThemedText>
			<View style={styles.button}>
				<Button title="Stop" onPress={stop}/>
			</View>
		</View>
	);
};

export default CachingView;
