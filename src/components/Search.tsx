import React, { useCallback, useEffect, useMemo } from 'react';
import { JamObjectType } from '../services/jam';
import { StyleSheet } from 'react-native';
import { Item } from './Item';
import { staticTheme } from '../style/theming';
import { useLazySearchQuery } from '../services/queries/search';
import { DefaultFlatList } from './DefaultFlatList.tsx';
import { ClickLabelIcon } from './ClickLabelIcon';
import { BaseEntry } from '../types/base.ts';

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
	// eslint-disable-next-line react-native/no-unused-styles
	sectionIcon: {
		fontSize: staticTheme.fontSizeLarge
	}
});

interface SearchProps {
	objType: JamObjectType;
	query?: string;
	backToAll?: () => void;
}

export const Search: React.FC<SearchProps> = ({ objType, query, backToAll }) => {
	const [getSearch, { loading, error, result }] = useLazySearchQuery(objType);
	const amount = 20;
	const entries = useMemo((): Array<BaseEntry> => (result?.entries ?? []), [result]);
	const total = useMemo(() => result?.total ?? 0, [result]);

	useEffect(() => {
		if (query) {
			// trigger initial search for first page
			getSearch(query, amount, 0);
		}
	}, [query, getSearch]);

	const handleBack = useCallback((): void => {
		if (backToAll) {
			backToAll();
		}
	}, [backToAll]);

	const handleLoadMore = useCallback((): void => {
		if (query) {
			const offset = entries.length;
			if (offset < (total ?? 0)) {
				getSearch(query, amount, offset);
			}
		}
	}, [entries.length, getSearch, query, total]);

	const reload = useCallback((): void => {
		if (query) {
			getSearch(query, amount, 0);
		}
	}, [query, getSearch]);

	const renderItem = useCallback(({ item }: { item: BaseEntry }): React.JSX.Element => (<Item item={item} />), []);

	return (
		<>
			<ClickLabelIcon label={objType} iconName="left-open" onPress={handleBack} style={styles.section} fontSize={styles.sectionIcon.fontSize} labelStyle={styles.sectionText} />
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
