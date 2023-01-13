import React, {useCallback, useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import throttle from 'lodash.throttle';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedIcon} from './ThemedIcon';

const styles = StyleSheet.create({
	inputGroup: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1
	},
	input: {
		flex: 1,
		paddingTop: 10,
		paddingRight: 10,
		paddingBottom: 10,
		paddingLeft: 0
	},
	inputIcon: {
		fontSize: 22,
		paddingHorizontal: staticTheme.padding
	},
	inputCancelIcon: {
		fontSize: 22,
		paddingHorizontal: staticTheme.padding
	},
	disabled: {
		opacity: 0.3
	}
});

export const SearchBar: React.FC<{ style?: ViewStyle, searchQueryChange?: (searchQuery?: string) => void }> = ({style, searchQueryChange}) => {
	const [search, setSearch] = useState<string | undefined>();
	const [query, setQuery] = useState<string | undefined>();
	const theme = useTheme();

	const handleSearch = useCallback((s?: string): void => {
		setSearch(s);
		if (searchQueryChange) {
			searchQueryChange(s);
		}
	}, [setSearch, searchQueryChange]);

	const handleChangeText = useCallback((q: string): void => {
		setQuery(q);
		if (q.length === 0) {
			handleSearch(q);
		} else {
			throttle(handleSearch, 1000)(q);
		}
	}, [handleSearch]);

	const handleSearchButton = useCallback((): void => {
		handleSearch(search);
	}, [handleSearch, search]);

	const handleClearButton = useCallback((): void => {
		setQuery(undefined);
		handleSearch(undefined);
	}, [handleSearch]);

	const isEmpty = (!query || query.length === 0);
	const cancel = !isEmpty
		? (
			<TouchableOpacity onPress={handleClearButton} style={styles.inputCancelIcon}>
				<ThemedIcon name="cancel" size={styles.inputCancelIcon.fontSize}/>
			</TouchableOpacity>
		)
		: <></>;
	return (
		<View style={[styles.inputGroup, {borderColor: theme.separator}, style]}>
			<TouchableOpacity onPress={handleSearchButton} style={[styles.inputIcon, isEmpty && styles.disabled]}>
				<ThemedIcon name="search" size={styles.inputIcon.fontSize}/>
			</TouchableOpacity>
			<TextInput
				style={[styles.input, {color: theme.textColor}]}
				placeholderTextColor={theme.muted}
				placeholder="Search"
				value={query}
				onChangeText={handleChangeText}
				returnKeyType="search"
				autoCapitalize="none"
			/>
			{cancel}
		</View>
	);
};
