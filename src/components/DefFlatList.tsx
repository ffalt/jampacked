import React from 'react';
import {useTheme} from '../style/theming';
import {FlatList, ListRenderItem, RefreshControl, StyleProp, ViewStyle} from 'react-native';
import {ListEmpty} from './ListEmpty';
import {Separator} from './Separator';
import {defaultItemLayout, defaultKeyExtractor} from '../utils/list.utils';
import {ErrorView} from './ErrorView';

interface DefaultFlatListParams<T> {
	style?: StyleProp<ViewStyle>;
	id?: string;
	error?: Error;
	onEndReachedThreshold?: number;
	onEndReached?: ((info: { distanceFromEnd: number }) => void) | null;
	ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
	renderItem: ListRenderItem<T> | null | undefined;
	items?: Array<T>;
	reload: () => void;
	loading: boolean;
}

export const DefaultFlatList: React.FC<DefaultFlatListParams<any>> = (
	{
		items, id, error, reload,
		renderItem, loading, style,
		ListHeaderComponent, onEndReachedThreshold, onEndReached
	}
) => {
	const theme = useTheme();
	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}
	return (
		<FlatList
			key={id}
			style={style}
			data={items || []}
			renderItem={renderItem}
			onEndReachedThreshold={onEndReachedThreshold}
			onEndReached={onEndReached}
			keyExtractor={defaultKeyExtractor}
			ItemSeparatorComponent={Separator}
			ListHeaderComponent={ListHeaderComponent}
			ListEmptyComponent={<ListEmpty list={items}/>}
			getItemLayout={defaultItemLayout}
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
	);
};
