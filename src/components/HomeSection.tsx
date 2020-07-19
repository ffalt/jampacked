import {ScrollView, StyleSheet, View} from 'react-native';
import {staticTheme} from '../style/theming';
import {HomeEntry} from '../services/types';
import React from 'react';
import {ThemedText} from './ThemedText';
import {HomeSectionEntry} from './HomeSectionEntry';

const styles = StyleSheet.create({
	headline: {
		letterSpacing: 2,
		textTransform: 'uppercase',
		fontSize: staticTheme.fontSizeSmall,
		fontWeight: 'bold',
		padding: staticTheme.padding,
		marginTop: staticTheme.margin
	}
});

export const HomeSection: React.FC<{ title: string; section?: Array<HomeEntry>; }> = React.memo(({section, title}) => {
	if (!section || section.length === 0) {
		return (<></>);
	}
	const entries = section.map(entry => <HomeSectionEntry key={entry.id} entry={entry}/>);
	return (
		<View>
			<ThemedText style={styles.headline}>{title}</ThemedText>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				{entries}
			</ScrollView>
		</View>
	);
});
