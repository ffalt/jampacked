import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {Separator} from '../components/Separator';
import {PageHeader} from '../components/PageHeader';
import {ListEmpty} from '../components/ListEmpty';
import {PinnedMediaItem} from './PinnedMediaItem';
import {PinMedia} from '../services/types';
import {usePinnedMedia} from '../services/pin-hooks';
import {defaultItemLayout, defaultKeyExtractor} from '../utils/list.utils';

export const PinnedMedia: React.FC = () => {
	const {media, loading} = usePinnedMedia();
	const renderItem = useCallback(({item}: { item: PinMedia }): JSX.Element => (<PinnedMediaItem item={item}/>), []);
	const ListHeaderComponent = useCallback((): JSX.Element => (<PageHeader title="Albums" subtitle="Pinned Media" titleIcon="album"/>), []);
	return (
		<FlatList
			data={media}
			key="pinned"
			renderItem={renderItem}
			keyExtractor={defaultKeyExtractor}
			ListEmptyComponent={<ListEmpty list={loading ? undefined : media}/>}
			ListHeaderComponent={ListHeaderComponent}
			ItemSeparatorComponent={Separator}
			getItemLayout={defaultItemLayout}
		/>
	);
};
