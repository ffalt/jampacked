import { ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { ThemedText } from './ThemedText';
import { HomeSectionEntry } from './HomeSectionEntry';
import { NavigationService } from '../navigators/navigation';
import { ThemedIcon } from './ThemedIcon';
import { sharedStyles } from '../style/shared';
import { useTheme } from '../style/theming';
import { HomeEntry } from '../types/home.ts';
import { NavigParameters } from '../types/navig.ts';

export const HomeSection: React.FC<{ title: string; section?: Array<HomeEntry>; sectionNavig?: { route: string; params?: NavigParameters } }> = React.memo(({ section, title, sectionNavig }) => {
	const theme = useTheme();
	if (!section || section.length === 0) {
		return (<></>);
	}

	const click = (): void => {
		if (sectionNavig) {
			NavigationService.navigate(sectionNavig.route, sectionNavig.params);
		}
	};

	const entries = section.map(entry => <HomeSectionEntry key={entry.id} entry={entry} />);
	return (
		<>
			<TouchableOpacity style={sharedStyles.sectionHeader} onPress={click}>
				<ThemedText style={sharedStyles.sectionHeaderText}>{title}</ThemedText>
				<ThemedIcon style={sharedStyles.sectionHeaderIcon} name="right-open" color={theme.muted} />
			</TouchableOpacity>
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				{entries}
			</ScrollView>
		</>
	);
});
