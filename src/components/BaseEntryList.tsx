import React, {useCallback, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import {useTheme} from '../style/theming';
import {PageHeader} from './PageHeader';
import {Separator} from './Separator';
import {commonItemLayout} from './AtoZList';
import {Item} from './Item';
import {ImageItem} from './ImageItem';
import {BaseEntry} from '../services/types';
import {useWindowWidth} from '../utils/dimension.hook';

const style = StyleSheet.create({
	row: {
		flex: 1,
		justifyContent: 'flex-start'
	}
});

export interface BaseEntryListInfo {
	title: string;
	subtitle: string;
	icon: string;
}

export const BaseEntryList: React.FC<{
	entries: Array<BaseEntry>;
	info: BaseEntryListInfo;
	refreshing: boolean;
	onRefresh: () => void;
	onLoadMore: () => void;
}> = ({info, entries, refreshing, onRefresh, onLoadMore}) => {
	const [tiles, setTiles] = useState<boolean>(false);
	const numColumns = 3;
	const width = useWindowWidth();
	const tileSize = width / (numColumns || 1);
	const theme = useTheme();

	const toggleView = useCallback((): void => {
		setTiles(!tiles);
	}, [tiles]);

	const renderItemRow = useCallback(({item}: { item: BaseEntry }): JSX.Element => (<Item item={item}/>), []);
	const renderItemTile = useCallback(({item}: { item: BaseEntry }): JSX.Element => (<ImageItem item={item} size={tileSize}/>), [tileSize]);
	const keyExtractor = (item: BaseEntry): string => item.id;
	const getItemLayout = React.useMemo(() => commonItemLayout(65), []);
	const ListHeaderComponent = (<PageHeader title={info.title} titleIcon={info.icon} subtitle={info.subtitle} tiles={tiles} toggleView={toggleView}/>);

	const getTileItemLayout = React.useMemo(() => commonItemLayout(tileSize), [tileSize]);

	if (tiles) {
		return (
			<FlatList
				data={entries}
				key="index"
				renderItem={renderItemTile}
				keyExtractor={keyExtractor}
				ItemSeparatorComponent={Separator}
				numColumns={numColumns}
				columnWrapperStyle={style.row}
				onEndReachedThreshold={0.4}
				onEndReached={onLoadMore}
				getItemLayout={getTileItemLayout}
				ListHeaderComponent={ListHeaderComponent}
				refreshControl={(
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						progressViewOffset={80}
						progressBackgroundColor={theme.refreshCtrlBackground}
						colors={theme.refreshCtrlColors}
					/>
				)}
			/>
		);
	}
	return (
		<FlatList
			data={entries}
			key="rows"
			renderItem={renderItemRow}
			keyExtractor={keyExtractor}
			ItemSeparatorComponent={Separator}
			getItemLayout={getItemLayout}
			onEndReachedThreshold={0.4}
			onEndReached={onLoadMore}
			ListHeaderComponent={ListHeaderComponent}
			refreshControl={(
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					progressViewOffset={80}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		/>
	);
};

