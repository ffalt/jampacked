import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BottomTabProps, BottomTabRoute} from '../navigators/Routing';
import {ThemesView} from '../components/ThemesView';
import {ThemedText} from '../components/ThemedText';
import {staticTheme} from '../style/theming';
import dataService from '../services/data';
import {CachingView} from '../components/CachingView';
import {MediaCachingView} from '../components/MediaCachingView';

const styles = StyleSheet.create({
	container: {
		paddingTop: staticTheme.statusBarOffset,
		paddingBottom: staticTheme.padding,
		paddingHorizontal: staticTheme.padding,
		flex: 1
	},
	userSection: {
		flexDirection: 'row'
	},
	userImage: {
		marginRight: staticTheme.margin
	},
	section: {
		paddingVertical: staticTheme.padding,
		letterSpacing: 2,
		textTransform: 'uppercase',
		fontSize: staticTheme.fontSizeSmall,
		fontWeight: 'bold',
		marginTop: staticTheme.margin,
		borderBottomColor: 'rgba(0,0,0,0.7)',
		borderBottomWidth: 1,
		marginBottom: staticTheme.marginSmall
	}
});

export const SettingsScreen: React.FC<BottomTabProps<BottomTabRoute.SETTINGS>> = () => {
	return (
		<View style={styles.container}>
			<ThemedText style={styles.section}>Cache</ThemedText>
			<CachingView cache={dataService.dataCaching} title="Data & Image Cache"/>
			<ThemedText style={styles.section}>Pinned Offline Tracks</ThemedText>
			<MediaCachingView/>
			<ThemedText style={styles.section}>Theme</ThemedText>
			<ThemesView/>
		</View>
	);
};
