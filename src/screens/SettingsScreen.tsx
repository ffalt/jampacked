import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BottomTabProps, BottomTabRoute} from '../navigators/Routing';
import {ThemesView} from '../components/ThemesView';
import {ThemedText} from '../components/ThemedText';
import {staticTheme} from '../style/theming';
import dataService from '../services/data';
import {CachingView} from '../components/CachingView';
import {MediaCachingView} from '../components/MediaCachingView';
import {PageHeader} from '../components/PageHeader';

const styles = StyleSheet.create({
	container: {
		paddingBottom: staticTheme.padding,
		paddingHorizontal: staticTheme.padding,
		flex: 1
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
		<>
			<PageHeader title="Settings" titleIcon="settings"/>
			<View style={styles.container}>
				<ThemedText style={styles.section}>Cache</ThemedText>
				<CachingView cache={dataService.cache.dataCaching} title="Data & Image Cache"/>
				<ThemedText style={styles.section}>Pinned Offline Tracks</ThemedText>
				<MediaCachingView/>
				<ThemedText style={styles.section}>Theme</ThemedText>
				<ThemesView/>
			</View>
		</>
	);
};
