import React, { useCallback } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { useTheme } from '../style/theming';
import { PageHeader } from './PageHeader';
import { Separator } from './Separator';
import { AtoZList } from './AtoZList';
import { Item } from './Item';
import { ImageItem } from './ImageItem';
import { Index, IndexEntry } from '../services/types';
import { useWindowWidth } from '../utils/dimension.hook';
import { ListEmpty } from './ListEmpty';
import { defaultKeyExtractor } from '../utils/list.utils';
import { sharedStyles } from '../style/shared';
import { RouteLink } from '../navigators/Routes';

const styles = StyleSheet.create({
	row: {
		flex: 1,
		justifyContent: 'flex-start'
	}
});

export const IndexList: React.FC<{
	index?: Index;
	title: string;
	refreshing: boolean;
	called: boolean;
	onRefresh: () => void;
	goLeft?: RouteLink;
	goRight?: RouteLink;
}> = ({ title, index, refreshing, onRefresh, goLeft, goRight }) => {
	const tiles = false;
	const numberColumns = 3;
	const width = useWindowWidth();
	const tileSize = width / (numberColumns || 1);
	const theme = useTheme();

	const renderItemRow = useCallback(({ item }: { item: IndexEntry }): React.JSX.Element => (<Item item={item} />), []);
	const renderItemTile = useCallback(({ item }: { item: IndexEntry }): React.JSX.Element => (<ImageItem item={item} size={tileSize} />), [tileSize]);

	const ListHeaderComponent = (<PageHeader title={title} goLeft={goLeft} goRight={goRight} />);
	const refreshControl = (
		<RefreshControl
			refreshing={refreshing}
			onRefresh={onRefresh}
			progressViewOffset={90}
			progressBackgroundColor={theme.refreshCtrlBackground}
			colors={theme.refreshCtrlColors}
		/>
	);
	const ListEmptyComponent = (<ListEmpty list={index} />);

	if (tiles) {
		return (
			<AtoZList
				data={index}
				key="tiles"
				renderItem={renderItemTile}
				keyExtractor={defaultKeyExtractor}
				numColumns={numberColumns}
				ListHeaderComponent={ListHeaderComponent}
				ListEmptyComponent={ListEmptyComponent}
				columnWrapperStyle={styles.row}
				itemHeight={tileSize}
				refreshControl={refreshControl}
			/>
		);
	}
	return (
		<AtoZList
			data={index}
			key="rows"
			renderItem={renderItemRow}
			keyExtractor={defaultKeyExtractor}
			ItemSeparatorComponent={Separator}
			ListHeaderComponent={ListHeaderComponent}
			ListEmptyComponent={ListEmptyComponent}
			refreshControl={refreshControl}
			itemHeight={sharedStyles.item.height + 1}
		/>
	);
};
