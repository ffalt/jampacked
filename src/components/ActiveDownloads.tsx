import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {Separator} from '../components/Separator';
import {DownloadTask} from 'react-native-background-downloader';
import {PageHeader} from '../components/PageHeader';
import {ListEmpty} from '../components/ListEmpty';
import {ActiveDownloadItem} from './ActiveDownloadItem';
import {useDownloads} from '../services/pin-hooks';
import {defaultItemLayout, defaultKeyExtractor} from '../utils/list.utils';

export const ActiveDownloads: React.FC = () => {
	const downloads = useDownloads();
	const renderItem = useCallback(({item}: { item: DownloadTask }): JSX.Element => (<ActiveDownloadItem item={item}/>), []);
	const ListHeaderComponent = useCallback((): JSX.Element => (<PageHeader title="Active Downloads" subtitle="Pinned Media" titleIcon="download"/>	), []);
	const ListEmptyComponent = (<ListEmpty list={downloads}/>);
	return (
		<FlatList
			data={downloads}
			key="downloads"
			renderItem={renderItem}
			keyExtractor={defaultKeyExtractor}
			ListEmptyComponent={ListEmptyComponent}
			ListHeaderComponent={ListHeaderComponent}
			ItemSeparatorComponent={Separator}
			getItemLayout={defaultItemLayout}
		/>
	);
};
