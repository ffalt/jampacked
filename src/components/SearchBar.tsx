import React, {useCallback, useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import throttle from 'lodash.throttle';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedIcon} from '../components/ThemedIcon';

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	input: {
		flex: 1,
		paddingTop: 10,
		paddingRight: 10,
		paddingBottom: 10,
		paddingLeft: 0
	},
	inputGroup: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomWidth: 1
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

export const SearchBar: React.FC<{ style?: ViewStyle }> = (style) => {
	const [search, setSearch] = useState<string | undefined>();
	const [query, setQuery] = useState<string | undefined>();
	const theme = useTheme();

	const handleInput = (s?: string): void => {
		setSearch(s);
	};

	const handleInputThrottled = throttle(handleInput, 1000);

	const handleChangeText = (q: string): void => {
		setQuery(q);
		if (q.length === 0) {
			setSearch(q);
		} else {
			handleInputThrottled(q);
		}
	};

	const handleSearch = useCallback((): void => {
		setSearch(search);
	}, [search]);

	const handleClear = useCallback((): void => {
		setQuery(undefined);
		setSearch(undefined);
	}, []);

	const isEmpty = (!query || query.length === 0);
	const cancel = !isEmpty
		? (
			<TouchableOpacity onPress={handleClear} style={styles.inputCancelIcon}>
				<ThemedIcon name="cancel" size={styles.inputCancelIcon.fontSize}/>
			</TouchableOpacity>
		)
		: <></>;
	return (
		<View style={[styles.inputGroup, {borderColor: theme.separator}, style?.style]}>
			<TouchableOpacity onPress={handleSearch} style={[styles.inputIcon, isEmpty && styles.disabled]}>
				<ThemedIcon name="search" size={styles.inputIcon.fontSize}/>
			</TouchableOpacity>
			<TextInput
				style={[styles.input, {color: theme.textColor}]}
				placeholderTextColor={theme.muted}
				placeholder="Filter"
				value={query}
				onChangeText={handleChangeText}
				returnKeyType="search"
				autoCapitalize="none"
			/>
			{cancel}
		</View>
	);
};
