import React, {useCallback, useState} from 'react';
import {RefreshControl, StyleSheet} from 'react-native';
import {useTheme} from '../style/theming';
import {PageHeader} from './PageHeader';
import {Separator} from './Separator';
import {AtoZList} from './AtoZList';
import {Item} from './Item';
import {ImageItem} from './ImageItem';
import {Index, IndexEntry} from '../services/types';
import {useWindowWidth} from '../utils/dimension.hook';

const style = StyleSheet.create({
	row: {
		flex: 1,
		justifyContent: 'flex-start'
	}
});

export const IndexList: React.FC<{
	index?: Index;
	title: string;
	titleIcon: string;
	refreshing: boolean;
	onRefresh: () => void;
}> = ({title, titleIcon, index, refreshing, onRefresh}) => {
	const [tiles, setTiles] = useState<boolean>(false);
	const numColumns = 3;
	const width = useWindowWidth();
	const tileSize = width / (numColumns || 1);
	const theme = useTheme();

	const toggleView = useCallback((): void => {
		setTiles(!tiles);
	}, [tiles]);

	const ListHeaderComponent = (<PageHeader title={title} titleIcon={titleIcon} tiles={tiles} toggleView={toggleView}/>);

	const renderItemRow = useCallback(({item}: { item: IndexEntry }): JSX.Element => (<Item item={item}/>), []);
	const renderItemTile = useCallback(({item}: { item: IndexEntry }): JSX.Element => (<ImageItem item={item} size={tileSize}/>), [tileSize]);
	const keyExtractor = (item: IndexEntry): string => item.id;

	if (tiles) {
		return (
			<AtoZList
				data={index}
				key="tiles"
				renderItem={renderItemTile}
				keyExtractor={keyExtractor}
				numColumns={numColumns}
				ListHeaderComponent={ListHeaderComponent}
				columnWrapperStyle={style.row}
				itemHeight={tileSize}
				refreshControl={(
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						progressViewOffset={90}
						progressBackgroundColor={theme.refreshCtrlBackground}
						colors={theme.refreshCtrlColors}
					/>
				)}
			/>
		);
	}
	return (
		<AtoZList
			data={index}
			key="rows"
			renderItem={renderItemRow}
			keyExtractor={keyExtractor}
			ItemSeparatorComponent={Separator}
			ListHeaderComponent={ListHeaderComponent}
			refreshControl={(
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					progressViewOffset={90}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
			itemHeight={65}
		/>
	);
};

