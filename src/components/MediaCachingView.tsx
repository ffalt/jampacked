import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { staticTheme, useTheme } from '../style/theming';
import { usePinCacheStat } from '../services/pin.hooks.ts';
import pinService from '../services/pin.service.ts';

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
	const theme = useTheme();
	const stat = usePinCacheStat();

	const clearMediaCache = useCallback((): void => {
		setRunning(true);
		pinService.clearPins()
			.then(() => {
				setRunning(false);
			})
			.catch(console.error);
	}, []);

	if (!running) {
		return (
			<View style={styles.container}>
				<View style={styles.text}>
					<ThemedText>
						Files:
						{stat?.files}
						{' '}
						{(stat?.files ?? 0) > 0 ? `(${stat?.humanSize})` : ''}
					</ThemedText>
				</View>
				<View style={styles.button}>
					<Button title="Clear" onPress={clearMediaCache} />
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ActivityIndicator size="small" color={theme.textColor} />
			<View style={styles.text}>
				<ThemedText>Removing...</ThemedText>
			</View>
			<View style={styles.button}>
				<Button title="Clear" onPress={clearMediaCache} />
			</View>
		</View>
	);
};
