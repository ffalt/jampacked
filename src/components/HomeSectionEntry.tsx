import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { staticTheme, useTheme } from '../style/theming';
import React from 'react';
import { NavigationService } from '../navigators/navigation';
import { JamImage } from './JamImage';
import { ThemedText } from './ThemedText';
import { HomeEntry } from '../types/home.ts';

const styles = StyleSheet.create({
	HomeSectionEntryText: {
		fontSize: staticTheme.fontSizeSmall,
		marginTop: staticTheme.marginSmall,
		marginBottom: staticTheme.marginSmall
	},
	HomeSectionEntry: {
		width: 120,
		paddingTop: staticTheme.padding,
		marginRight: staticTheme.margin,
		alignItems: 'center',
		borderRadius: 4,
		backgroundColor: 'rgba(0,0,0,0.2)'
	}
});

export const HomeSectionEntry: React.FC<{ entry: HomeEntry }> = React.memo(({ entry }) => {
	const theme = useTheme();

	const click = (): void => {
		NavigationService.navigate(entry.route, { id: entry.id, name: entry.name });
	};

	return (
		<TouchableOpacity onPress={click}>
			<View style={[styles.HomeSectionEntry, { backgroundColor: theme.itemBackground }]}>
				<JamImage id={entry.id} size={staticTheme.thumbMedium} />
				<ThemedText numberOfLines={1} style={styles.HomeSectionEntryText}>{entry.name}</ThemedText>
			</View>
		</TouchableOpacity>
	);
});
