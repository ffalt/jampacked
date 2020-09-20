import React from 'react';
import {StyleSheet, View} from 'react-native';
import {AppStackProps, Routing} from '../navigators/Routing';
import {Logo} from '../components/Logo';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingBottom: 8
	}
});

export const LoadingScreen: React.FC<AppStackProps<Routing.LOAD>> = React.memo(() =>
	(
		<View style={styles.container}>
			<Logo size={104}/>
		</View>
	)
);
