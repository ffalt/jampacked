import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppStackProps, AppRouting } from '../navigators/Routing';
import { Logo } from '../components/Logo';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 50,
		paddingBottom: 0
	}
});

export const LoadingScreen: React.FC<AppStackProps<AppRouting.LOAD>> = React.memo(() =>
	(
		<View style={styles.container}>
			<Logo size={104} />
		</View>
	)
);
