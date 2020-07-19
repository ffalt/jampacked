import React, {useEffect, useState} from 'react';
import {JamObjectType} from '../services/jam';
import {FlatList, RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThemedText} from './ThemedText';
import {commonItemLayout} from './AtoZList';
import {Separator} from './Separator';
import {Item} from './Item';
import {staticTheme, useTheme} from '../style/theming';
import {ThemedIcon} from './ThemedIcon';
import {BaseEntry, SearchResultData} from '../services/types';
import {useLazySearchQuery} from '../services/queries/search';
import {snackError} from '../services/snack';

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
	const [data, setData] = useState<SearchResultData | undefined>();
	const [search, setSearch] = useState<{ query: string, offset: number } | undefined>();
	const [getSearch, {loading, error, result}] = useLazySearchQuery(objType);
	const amount = 10;
	const theme = useTheme();

	useEffect(() => {
		if (query) {
			setData(undefined);
			setSearch({query, offset: 0});
		}
	}, [query, objType]);

	useEffect(() => {
		if (search) {
			getSearch(search.query, amount, search?.offset);
		}
	}, [getSearch, search]);

	useEffect(() => {
		if (result) {
			if (search?.query === result.query && data) {
				setData({...result, entries: result.entries.concat(data.entries)});
			} else {
				setData(result);
			}
		}
	}, [result, data, search]);

	if (error) {
		snackError(error);
	}

	const handleBack = (): void => {
		if (backToAll) {
			backToAll();
		}
	};

	const handleLoadMore = (): void => {
		if (loading) {
			return;
		}
		if (search && data) {
			const offset = search.offset + amount;
			if (search.offset + amount < data.total) {
				setSearch({query: search.query, offset});
			}
		}
	};

	const reload = (): void => {
		setData(undefined);
		if (query) {
			setSearch({query, offset: 0});
		}
	};

	const getItemLayout = React.useMemo(() => commonItemLayout(65), []);
	const keyExtractor = (item: BaseEntry): string => item.id;
	const renderItem = ({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>);

	return (
		<View>
			<TouchableOpacity style={styles.section} onPress={handleBack}>
				<ThemedIcon size={styles.sectionIcon.fontSize} name="left-open"/>
				<ThemedText style={styles.sectionText}>{objType}</ThemedText>
			</TouchableOpacity>
			<FlatList
				data={data?.entries}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				ItemSeparatorComponent={Separator}
				getItemLayout={getItemLayout}
				onEndReachedThreshold={0.4}
				onEndReached={handleLoadMore}
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
		</View>
	);
};
