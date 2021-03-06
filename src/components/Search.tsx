import React, {useCallback, useEffect, useState} from 'react';
import {JamObjectType} from '../services/jam';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ThemedText} from './ThemedText';
import {Item} from './Item';
import {staticTheme} from '../style/theming';
import {ThemedIcon} from './ThemedIcon';
import {BaseEntry} from '../services/types';
import {useLazySearchQuery} from '../services/queries/search';
import {DefaultFlatList} from './DefFlatList';

const styles = StyleSheet.create({
	section: {
		flexDirection: 'row',
		alignItems: 'center',
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

interface SearchProps {
	objType: JamObjectType;
	query?: string;
	backToAll?: () => void;
}

export const Search: React.FC<SearchProps> = ({objType, query, backToAll}) => {
	const [q, setQ] = useState<string | undefined>();
	const [total, setTotal] = useState<number>(0);
	const [offset, setOffset] = useState<number>(0);
	const [entries, setEntries] = useState<Array<BaseEntry>>([]);
	const [getSearch, {loading, error, result}] = useLazySearchQuery(objType);
	const amount = 20;

	useEffect(() => {
		if (query) {
			setEntries([]);
			setOffset(0);
			setQ(query);
		}
	}, [query]);

	useEffect(() => {
		if (q) {
			getSearch(q, amount, offset);
		}
	}, [getSearch, q, offset]);

	useEffect(() => {
		if (result?.entries?.length) {
			setTotal(result.total);
			setEntries((prev) => {
				return prev.concat(result.entries);
			});
		}
	}, [result]);

	const handleBack = useCallback((): void => {
		if (backToAll) {
			backToAll();
		}
	}, [backToAll]);

	const handleLoadMore = useCallback((): void => {
		setOffset((prev => {
			if (prev + amount > total) {
				return prev;
			}
			return prev + amount;
		}));
	}, [total]);

	const reload = useCallback((): void => {
		if (q) {
			setEntries([]);
			setOffset(0);
			getSearch(q, amount, offset);
		}
	}, [q, getSearch, offset]);

	const renderItem = useCallback(({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>), []);

	return (
		<>
			<TouchableOpacity style={styles.section} onPress={handleBack}>
				<ThemedIcon size={styles.sectionIcon.fontSize} name="left-open"/>
				<ThemedText style={styles.sectionText}>{objType}</ThemedText>
			</TouchableOpacity>
			<DefaultFlatList
				items={entries}
				renderItem={renderItem}
				onEndReachedThreshold={0.4}
				onEndReached={handleLoadMore}
				error={error}
				loading={loading}
				reload={reload}
			/>
		</>
	);
};
