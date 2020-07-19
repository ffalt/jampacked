import {StyleSheet, View} from 'react-native';
import {staticTheme} from '../style/theming';
import {HomeStatData} from '../services/types';
import React from 'react';
import {ThemedText} from './ThemedText';
import {HomeStat} from './HomeStat';

const styles = StyleSheet.create({
	homeStatContainer: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	headline: {
		letterSpacing: 2,
		textTransform: 'uppercase',
		fontSize: staticTheme.fontSizeSmall,
		fontWeight: 'bold',
		padding: staticTheme.padding,
		marginTop: staticTheme.margin
	}
});

export const HomeStats: React.FC<{ stats?: Array<HomeStatData>; }> = React.memo(({stats}) => {
	const entries = stats && stats.length > 0
		? stats.map(stat => <HomeStat key={stat.text} stat={stat}/>)
		: [];
	return (
		<>
			<ThemedText style={styles.headline}>Library</ThemedText>
			<View style={styles.homeStatContainer}>{entries}</View>
		</>
	);
});
