import React, {useCallback} from 'react';
import {DownloadTask} from 'react-native-background-downloader';
import {PageHeader} from '../components/PageHeader';
import {ActiveDownloadItem} from '../components/ActiveDownloadItem';
import {useDownloads} from '../services/pin-hooks';
import {DefaultFlatList} from '../components/DefFlatList';
import {DownloadsRoute, DownloadsRouteProps} from '../navigators/Routing';

export const DownloadsActiveScreen: React.FC<DownloadsRouteProps<DownloadsRoute.ACTIVE>> = () => {
	const downloads = useDownloads();
	const renderItem = useCallback(({item}: { item: DownloadTask }): JSX.Element => (<ActiveDownloadItem item={item}/>), []);
	const ListHeaderComponent = (<PageHeader title="Active Downloads" subtitle="Pinned Media" titleIcon="download"/>);
	const reload = useCallback(() => {
		//TODO reload active download list
	}, []);
	return (
		<DefaultFlatList
			items={downloads}
			renderItem={renderItem}
			ListHeaderComponent={ListHeaderComponent}
			loading={false}
			reload={reload}
		/>
	);
};
