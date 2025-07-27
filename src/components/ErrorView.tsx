import React, { useEffect, useState } from 'react';
import { ThemedText } from './ThemedText';
import { snackError } from '../services/snack';
import { Button, Image, StyleSheet, View } from 'react-native';
import { IMAGE_ERROR } from '../style/images';
import { staticTheme } from '../style/theming';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		padding: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		marginVertical: staticTheme.margin
	},
	image: {
		height: 140,
		width: 140
	}
});

export const ErrorView: React.FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => {
	const [value, setValue] = useState<string>('');

	useEffect(() => {
		let text = error.message;
		// 'Looks like you are not connected to the internet.'
		// + ' Please check your internet settings.'

		if (text.startsWith('Network error:')) {
			text = text.slice(14);
		}
		setValue(text);

		snackError(error);
	}, [error]);

	return (
		<View style={styles.container}>
			<Image style={styles.image} source={IMAGE_ERROR} />
			<ThemedText style={styles.text}>{value}</ThemedText>
			<Button onPress={onRetry} title="Retry" />
		</View>
	);
};
