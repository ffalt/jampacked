import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Button, StyleSheet, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {staticTheme} from '../style/theming';
import dataService from '../services/data';
import {useMediaCacheStat} from '../services/cache-hooks';

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

export const MediaCachingView: React.FC = () => {
	const [running, setRunning] = useState<boolean>(false);

	const stat = useMediaCacheStat();

	const clearMediaCache = useCallback((): void => {
		setRunning(true);
		dataService.pin.clearPins()
			.then(() => {
				setRunning(false);
			})
			.catch(e => {
				console.error(e);
			});
	}, []);

	if (!running) {
		return (
			<View style={styles.container}>
				<View style={styles.text}>
					<ThemedText>Files: {stat?.files}</ThemedText>
					<ThemedText>Size: {stat?.humanSize}</ThemedText>
				</View>
				<View style={styles.button}>
					<Button title="Clear" onPress={clearMediaCache}/>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ActivityIndicator size="small"/>
			<View style={styles.text}>
				<ThemedText>Removing...</ThemedText>
			</View>
			<View style={styles.button}>
				<Button title="Clear" onPress={clearMediaCache}/>
			</View>
		</View>
	);
};
