import React from 'react';
import { StyleSheet, View } from 'react-native';
import { sharedStyles } from '../style/shared';
import { ThemedText } from './ThemedText';
import { Stat } from './Stat';
import { JamRouteLinks } from '../navigators/Routes';
import { usePinnedCount } from '../services/pin-hooks';

const styles = StyleSheet.create({
	homeStatContainer: {
		width: '100%',
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
});

export const HomeAppSection: React.FC = () => {
	const pinCount = usePinnedCount();
	return (
		<>
			<View style={sharedStyles.sectionHeader}>
				<ThemedText style={sharedStyles.sectionHeaderText}>Pinned</ThemedText>
			</View>
			<View style={styles.homeStatContainer}>
				<Stat key="Media" stat={{ link: JamRouteLinks.pinned(), value: pinCount }}/>
			</View>
		</>
	);
};
