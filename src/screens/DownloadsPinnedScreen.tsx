import React, {useCallback} from 'react';
import {PageHeader} from '../components/PageHeader';
import {PinnedMediaItem} from '../components/PinnedMediaItem';
import {PinMedia} from '../services/types';
import {usePinnedMedia} from '../services/pin-hooks';
import {DefaultFlatList} from '../components/DefFlatList';
import {DownloadsRoute, DownloadsRouteProps} from '../navigators/Routing';

export const DownloadsPinnedScreen: React.FC<DownloadsRouteProps<DownloadsRoute.PINNED>> = () => {
	const {media, loading} = usePinnedMedia();
	const renderItem = useCallback(({item}: { item: PinMedia }): JSX.Element => (<PinnedMediaItem item={item}/>), []);
	const ListHeaderComponent = (<PageHeader title="Albums" subtitle="Pinned Media" titleIcon="album"/>);
	const reload = useCallback(() => {
		//TODO reload pinned download list
	}, []);
	return (
		<DefaultFlatList
			items={media}
			renderItem={renderItem}
			ListHeaderComponent={ListHeaderComponent}
			loading={loading}
			reload={reload}
		/>
	);
};
