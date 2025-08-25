import React, { useEffect, useState } from 'react';
import { ThemedText } from './ThemedText';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../style/theming';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 0,
		marginTop: 80,
		alignItems: 'center',
		justifyContent: 'center'
	},
	empty: {
		letterSpacing: 2
	}
});

export const ListEmpty: React.FC<{ list?: Array<any> }> = ({ list }) => {
	const [text, setText] = useState('');
	const theme = useTheme();

	useEffect(() => {
		let isSubscribed = false;
		let delayDebounceFunction: ReturnType<typeof setTimeout> | undefined;
		if (list) {
			setText((list.length > 0 ? '' : 'No entries'));
		} else {
			isSubscribed = true;
			setText('');
			delayDebounceFunction = setTimeout(() => {
				if (isSubscribed) {
					setText('Loading');
				}
			}, 700);
		}
		return (): void => {
			if (isSubscribed) {
				isSubscribed = false;
				clearTimeout(delayDebounceFunction);
			}
		};
	}, [list]);

	return (
		<View style={styles.container}>
			<ThemedText style={[styles.empty, { color: theme.muted }]}>{text}</ThemedText>
		</View>
	);
};
