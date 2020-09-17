import React, {useCallback} from 'react';
import {ActivityIndicator, Button, StyleSheet, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {staticTheme} from '../style/theming';
import {useCacheManagement} from '../services/cache-hooks';

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

export const CachingView: React.FC<{ title: string }> = ({title}) => {
	const [fill, clear, stop, state] = useCacheManagement();

	const startCache = useCallback((): void => {
		fill();
	}, [fill]);

	const stopCache = useCallback((): void => {
		stop();
	}, [stop]);

	const clearCache = useCallback((): void => {
		clear();
	}, [clear]);

	if (!state.isRunning) {
		return (
			<View style={styles.container}>
				<ThemedText style={styles.text}>{title}</ThemedText>
				<View style={styles.button}>
					<Button title="Optimize" onPress={startCache}/>
				</View>
				<View style={styles.button}>
					<Button title="Clear" onPress={clearCache}/>
				</View>
			</View>
		);
	}
	return (
		<View style={styles.container}>
			<ActivityIndicator size="small"/>
			<ThemedText style={styles.text}>{state.message}</ThemedText>
			<View style={styles.button}>
				<Button title="Stop" onPress={stopCache}/>
			</View>
		</View>
	);
};
