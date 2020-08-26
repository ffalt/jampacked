import React, {useCallback, useEffect, useState} from 'react';
import {JamObjectType} from '../services/jam';
import {RefreshControl, SectionList, SectionListData, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {ThemedIcon} from './ThemedIcon';
import {NavigationService} from '../services/navigation';
import {JamImage} from './JamImage';
import {Separator} from './Separator';
import {snackError} from '../services/snack';
import {staticTheme, useTheme} from '../style/theming';
import {AutoCompleteData, AutoCompleteDataSection, AutoCompleteEntryData} from '../services/types';
import {useLazyAutocompleteQuery} from '../services/queries/autocomplete';

const styles = StyleSheet.create({
	item: {
		padding: staticTheme.padding,
		flexDirection: 'row',
		alignItems: 'center'
	},
	list: {
		flex: 1
	},
	itemText: {
		fontSize: staticTheme.fontSize
	},
	itemContent: {
		alignSelf: 'stretch',
		paddingLeft: staticTheme.padding,
		justifyContent: 'center',
		flexDirection: 'column',
		flex: 1
	},
	section: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		padding: staticTheme.padding
	},
	sectionText: {
		flex: 1,
		fontSize: staticTheme.fontSizeLarge,
		textTransform: 'capitalize',
		fontWeight: 'bold',
		paddingLeft: staticTheme.padding
	},
	sectionIcon: {
		fontSize: staticTheme.fontSizeLarge
	}
});

interface SearchQuickProps {
	query?: string;
	setObjType?: (objType: JamObjectType) => void;
}

export const SearchQuick: React.FC<SearchQuickProps> = ({query, setObjType}) => {
	const [list, setList] = useState<AutoCompleteData>([]);
	const [getAutocomplete, {loading, sections, error}] = useLazyAutocompleteQuery();
	const theme = useTheme();

	useEffect(() => {
		if (query) {
			getAutocomplete(query);
		}
	}, [getAutocomplete, query]);


	useEffect(() => {
		if (!loading && sections) {
			setList(sections);
		}
	}, [sections, loading]);

	if (error) {
		snackError(error);
	}

	const reload = useCallback((): void => {
		if (query) {
			getAutocomplete(query);
		}
	}, [getAutocomplete, query]);

	const renderSection =  useCallback(({section}: { section: SectionListData<AutoCompleteEntryData> }): JSX.Element => {
		const setType = (): void => {
			if (setObjType) {
				const {objType} = section as AutoCompleteDataSection;
				setObjType(objType);
			}
		};
		const icon = (section.data.length >= 5) && <ThemedIcon size={styles.sectionIcon.fontSize} name="right-open"/>;
		return (
			<View>
				<TouchableOpacity style={styles.section} onPress={setType}>
					<ThemedText style={styles.sectionText}>{section.key}</ThemedText>
					{icon}
				</TouchableOpacity>
			</View>
		);
	}, [setObjType]);

	const renderItem = useCallback(({item}: { item: AutoCompleteEntryData }): JSX.Element => {

		const click = (): void => {
			const route = NavigationService.routeByObjType(item.objType);
			if (route) {
				NavigationService.navigate(route, {id: item.id, name: item.name});
			}
		};

		return (
			<TouchableOpacity onPress={click} style={styles.item}>
				<JamImage id={item.id} size={28}/>
				<View style={styles.itemContent}>
					<ThemedText style={styles.itemText}>{item.name}</ThemedText>
				</View>
			</TouchableOpacity>
		);
	}, []);

	const keyExtractor = (item: AutoCompleteEntryData): string => item.id;

	return (
		<SectionList
			style={styles.list}
			sections={list}
			ItemSeparatorComponent={Separator}
			SectionSeparatorComponent={Separator}
			keyExtractor={keyExtractor}
			renderSectionHeader={renderSection}
			renderItem={renderItem}
			refreshControl={(
				<RefreshControl
					refreshing={loading}
					onRefresh={reload}
					progressViewOffset={80}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		/>
	);
};
