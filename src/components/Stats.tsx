import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ThemedText } from './ThemedText';
import { Stat } from './Stat';
import { sharedStyles } from '../style/shared';
import { HomeStatData } from '../types/home-stats.ts';

const styles = StyleSheet.create({
	homeStatContainer: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
});

export const Stats: React.FC<{ stats?: Array<HomeStatData>; label: string }> = React.memo(({ stats, label }) => {
	const entries = stats && stats.length > 0 ?
		stats.map(stat => <Stat key={stat.link.title} stat={stat} />) :
		[];
	if (entries.length === 0) {
		return (<></>);
	}
	return (
		<>
			<View style={sharedStyles.sectionHeader}>
				<ThemedText style={sharedStyles.sectionHeaderText}>{label}</ThemedText>
			</View>
			<View style={styles.homeStatContainer}>{entries}</View>
		</>
	);
});
