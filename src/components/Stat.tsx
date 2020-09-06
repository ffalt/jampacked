import {StyleSheet, TouchableOpacity} from 'react-native';
import {staticTheme, useTheme} from '../style/theming';
import {HomeStatData} from '../services/types';
import React from 'react';
import {NavigationService} from '../services/navigation';
import {ThemedText} from './ThemedText';

const styles = StyleSheet.create({
	homeStat: {
		margin: '1%',
		width: '31%',
		alignItems: 'center',
		padding: staticTheme.padding,
		borderRadius: 4
	},
	homeStatValue: {
		fontWeight: 'bold',
		fontSize: staticTheme.fontSizeLarge
	},
	homeStatDesc: {
		fontSize: staticTheme.fontSizeSmall
	}
});


export const Stat: React.FC<{ stat: HomeStatData }> = React.memo(({stat}) => {
	const theme = useTheme();

	const click = (): void => {
		NavigationService.navigateLink(stat.link);
	};

	return (
		<TouchableOpacity onPress={click} style={[styles.homeStat, {backgroundColor: theme.itemBackground}]}>
			<ThemedText style={styles.homeStatValue}>{stat.value}</ThemedText>
			<ThemedText style={styles.homeStatDesc}>{stat.text}</ThemedText>
		</TouchableOpacity>
	);
});
