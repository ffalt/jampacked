import React, {useCallback, useEffect, useState} from 'react';
import {JamObjectType} from '../services/jam';
import {SectionListData, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {ThemedIcon} from './ThemedIcon';
import {NavigationService} from '../navigators/navigation';
import {JamImage} from './JamImage';
import {staticTheme} from '../style/theming';
import {AutoCompleteData, AutoCompleteDataSection, AutoCompleteEntryData} from '../services/types';
import {useLazyAutocompleteQuery} from '../services/queries/autocomplete';
import {sharedStyles} from '../style/shared';
import {DefaultSectionList} from './DefSectionList';

const styles = StyleSheet.create({
	list: {
		flex: 1
	}
});

interface SearchQuickProps {
	query?: string;
	setObjType?: (objType: JamObjectType) => void;
}

export const SearchQuick: React.FC<SearchQuickProps> = ({query, setObjType}) => {
	const [list, setList] = useState<AutoCompleteData>([]);
	const [getAutocomplete, {loading, sections, error}] = useLazyAutocompleteQuery();

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

	const reload = useCallback((): void => {
		if (query) {
			getAutocomplete(query);
		}
	}, [getAutocomplete, query]);

	const renderSection = useCallback(({section}: { section: SectionListData<AutoCompleteEntryData> }): JSX.Element => {
		const setType = (): void => {
			if (setObjType) {
				const {objType} = section as AutoCompleteDataSection;
				setObjType(objType);
			}
		};
		return (
			<TouchableOpacity style={sharedStyles.sectionHeader} onPress={setType}>
				<ThemedText style={sharedStyles.sectionHeaderText}>{section.key}</ThemedText>
				{(section.data.length >= 5) && <ThemedIcon style={sharedStyles.sectionHeaderIcon} name="right-open"/>}
			</TouchableOpacity>
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
			<TouchableOpacity onPress={click} style={sharedStyles.item}>
				<JamImage id={item.id} size={staticTheme.thumb} style={sharedStyles.itemSectionLeft}/>
				<View style={sharedStyles.itemContent}>
					<ThemedText style={sharedStyles.itemText} numberOfLines={2}>{item.name}</ThemedText>
				</View>
			</TouchableOpacity>
		);
	}, []);

	return (
		<DefaultSectionList
			style={styles.list}
			sections={list}
			renderSectionHeader={renderSection}
			renderItem={renderItem}
			error={error}
			loading={loading}
			reload={reload}
		/>
	);
};
