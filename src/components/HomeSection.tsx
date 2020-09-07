import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {staticTheme} from '../style/theming';
import {HomeEntry} from '../services/types';
import React from 'react';
import {ThemedText} from './ThemedText';
import {HomeSectionEntry} from './HomeSectionEntry';
import {NavigationService} from '../services/navigation';

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

export const HomeSection: React.FC<{ title: string; section?: Array<HomeEntry>; sectionNavig?: { route: string, params: any } }> = React.memo(({section, title, sectionNavig}) => {
	if (!section || section.length === 0) {
		return (<></>);
	}

	const click = (): void => {
		if (sectionNavig) {
			NavigationService.navigate(sectionNavig.route, sectionNavig.params);
		}
	};

	const entries = section.map(entry => <HomeSectionEntry key={entry.id} entry={entry}/>);
	return (
		<>
			<TouchableOpacity onPress={click}>
				<ThemedText style={styles.headline}>{title}</ThemedText>
			</TouchableOpacity>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				{entries}
			</ScrollView>
		</>
	);
});
