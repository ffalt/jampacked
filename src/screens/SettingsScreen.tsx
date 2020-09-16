import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BottomTabProps, BottomTabRoute} from '../navigators/Routing';
import {ThemesView} from '../components/ThemesView';
import {ThemedText} from '../components/ThemedText';
import dataService from '../services/data';
import {CachingView} from '../components/CachingView';
import {MediaCachingView} from '../components/MediaCachingView';
import {PageHeader} from '../components/PageHeader';
import {sharedStyles} from '../style/shared';
import {staticTheme} from '../style/theming';

const styles = StyleSheet.create({
	container: {
		padding: staticTheme.padding,
		flex: 1
	},
	sectionFirst: {
		paddingBottom: staticTheme.paddingSmall
	},
	section: {
		paddingTop: staticTheme.paddingLarge,
		paddingBottom: staticTheme.paddingSmall
	}
});

export const SettingsScreen: React.FC<BottomTabProps<BottomTabRoute.SETTINGS>> = () => {
	return (
		<>
			<PageHeader title="Settings" titleIcon="settings"/>
			<View style={styles.container}>
				<View style={[sharedStyles.sectionHeader, styles.sectionFirst]}>
					<ThemedText style={sharedStyles.sectionHeaderText}>Cache</ThemedText>
				</View>
				<CachingView cache={dataService.cache.dataCaching} title="Data & Image Cache"/>
				<View style={[sharedStyles.sectionHeader, styles.section]}>
					<ThemedText style={sharedStyles.sectionHeaderText}>Pinned Offline Tracks</ThemedText>
				</View>
				<MediaCachingView/>
				<View style={[sharedStyles.sectionHeader, styles.section]}>
					<ThemedText style={sharedStyles.sectionHeaderText}>Theme</ThemedText>
				</View>
				<ThemesView/>
			</View>
		</>
	);
};
