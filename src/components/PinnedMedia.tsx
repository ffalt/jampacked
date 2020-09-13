import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {Separator} from '../components/Separator';
import {commonItemLayout} from '../components/AtoZList';
import {PageHeader} from '../components/PageHeader';
import {usePinnedMedia} from '../services/cache-hooks';
import {ListEmpty} from '../components/ListEmpty';
import {PinMedia} from '../services/data';
import {PinnedMediaItem} from './PinnedMediaItem';

export const PinnedMedia: React.FC = () => {
	const {media, loading} = usePinnedMedia();
	const getItemLayout = React.useMemo(() => commonItemLayout(65), []);
	const keyExtractor = (item: PinMedia): string => item.id;
	const renderItem = useCallback(({item}: { item: PinMedia }): JSX.Element => (<PinnedMediaItem item={item}/>), []);
	const ListHeaderComponent = (<PageHeader title="Albums" subtitle="Pinned Media" titleIcon="album"/>);
	return (
		<FlatList
			data={media}
			key="pinned"
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			ListEmptyComponent={<ListEmpty list={loading ? undefined : media}/>}
			ListHeaderComponent={ListHeaderComponent}
			ItemSeparatorComponent={Separator}
			getItemLayout={getItemLayout}
		/>
	);
};
