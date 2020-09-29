import React, {useCallback, useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import throttle from 'lodash.throttle';
import {BottomTabProps, BottomTabRoute} from '../navigators/Routing';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedIcon} from '../components/ThemedIcon';
import {JamObjectType} from '../services/jam';
import {SearchQuick} from '../components/SearchQuick';
import {Search} from '../components/Search';
import {PageHeader} from '../components/PageHeader';

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

export const SearchScreen: React.FC<BottomTabProps<BottomTabRoute.SEARCH>> = () => {
	const [search, setSearch] = useState<string | undefined>();
	const [query, setQuery] = useState<string | undefined>();
	const [objType, setObjType] = useState<JamObjectType | undefined>();
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

	const handleSearch = (): void => {
		handleInput(search);
	};

	const handleClear = useCallback((): void => {
		setQuery(undefined);
		setSearch(undefined);
	}, []);

	const setObjectTypeSearch = useCallback((ot?: JamObjectType): void => {
		setObjType(ot);
	}, []);

	const backToAll = (): void => {
		setObjType(undefined);
	};

	const isEmpty = (!query || query.length === 0);
	const cancel = !isEmpty
		? (
			<TouchableOpacity onPress={handleClear} style={styles.inputCancelIcon}>
				<ThemedIcon name="cancel" size={styles.inputCancelIcon.fontSize}/>
			</TouchableOpacity>
		)
		: <></>;
	const content = !objType
		? (<SearchQuick query={search} setObjType={setObjectTypeSearch}/>)
		: (<Search query={search} objType={objType} backToAll={backToAll}/>);
	return (
		<>
			<PageHeader title="Search" titleIcon="search"/>
			<View style={styles.container}>
				<View style={[styles.inputGroup, {borderColor: theme.separator}]}>
					<TouchableOpacity onPress={handleSearch} style={[styles.inputIcon, isEmpty && styles.disabled]}>
						<ThemedIcon name="search" size={styles.inputIcon.fontSize}/>
					</TouchableOpacity>
					<TextInput
						style={[styles.input, {color: theme.textColor}]}
						placeholderTextColor={theme.muted}
						placeholder="Enter Text to Search"
						value={query}
						onChangeText={handleChangeText}
						returnKeyType="search"
						autoCapitalize="none"
					/>
					{cancel}
				</View>
				{content}
			</View>
		</>
	);
};
