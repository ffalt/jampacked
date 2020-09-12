import React from 'react';
import {ThemedText} from './ThemedText';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		padding: 0,
		alignItems: 'center',
		justifyContent: 'center'
	},
	image: {
		height: 200,
		width: 200
	}
});

export const ListEmpty: React.FC<{ loading: boolean; called: boolean }> = ({loading, called}) => {
	return (
		<View style={styles.container}>
			<ThemedText>{!called || loading ? 'Loading' : 'No data'}</ThemedText>
		</View>
	);
};
