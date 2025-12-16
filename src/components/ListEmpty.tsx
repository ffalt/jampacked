import React, { useMemo } from 'react';
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
	const theme = useTheme();

	const text = useMemo(() => {
		if (list === undefined) {
			return 'Loading';
		}
		if (list.length === 0) {
			return 'No entries';
		}
		return '';
	}, [list]);

	return (
		<View style={styles.container}>
			<ThemedText style={[styles.empty, { color: theme.muted }]}>{text}</ThemedText>
		</View>
	);
};
