import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useTheme } from '../style/theming';
import { PageHeader } from './PageHeader';
import { Separator } from './Separator';
import { Item } from './Item';
import { ImageItem } from './ImageItem';
import { BaseEntry } from '../services/types';
import { useWindowWidth } from '../utils/dimension.hook';
import { ListEmpty } from './ListEmpty';
import { commonItemLayout, defaultKeyExtractor } from '../utils/list.utils';
import { DefaultFlatList } from './DefaultFlatList.tsx';
import { RouteLink } from '../navigators/Routes';

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
	entries?: Array<BaseEntry>;
	info: BaseEntryListInfo;
	goLeft?: RouteLink;
	goRight?: RouteLink;
	refreshing: boolean;
	onRefresh: () => void;
	onLoadMore: () => void;
}> = ({ info, entries, refreshing, onRefresh, onLoadMore, goLeft, goRight }) => {
	const [tiles, _setTiles] = useState<boolean>(false);
	const numberColumns = 3;
	const width = useWindowWidth();
	const tileSize = width / (numberColumns || 1);
	const theme = useTheme();

	const renderItemRow = useCallback(({ item }: { item: BaseEntry }): React.JSX.Element => (<Item item={item} />), []);
	const renderItemTile = useCallback(({ item }: { item: BaseEntry }): React.JSX.Element => (<ImageItem item={item} size={tileSize} />), [tileSize]);
	const ListHeaderComponent = (<PageHeader title={info.title} goLeft={goLeft} goRight={goRight} subtitle={info.subtitle} />);

	const getTileItemLayout = React.useMemo(() => commonItemLayout(tileSize), [tileSize]);

	if (tiles) {
		return (
			<FlatList
				data={entries ?? []}
				key="index"
				renderItem={renderItemTile}
				keyExtractor={defaultKeyExtractor}
				ItemSeparatorComponent={Separator}
				numColumns={numberColumns}
				columnWrapperStyle={style.row}
				onEndReachedThreshold={0.4}
				onEndReached={onLoadMore}
				getItemLayout={getTileItemLayout}
				ListHeaderComponent={ListHeaderComponent}
				ListEmptyComponent={<ListEmpty list={entries} />}
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
		<DefaultFlatList
			id="rows"
			items={entries}
			renderItem={renderItemRow}
			ListHeaderComponent={ListHeaderComponent}
			onEndReachedThreshold={0.4}
			onEndReached={onLoadMore}
			loading={refreshing}
			reload={onRefresh}
		/>
	);
};
