import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {Separator} from '../components/Separator';
import {commonItemLayout} from '../components/AtoZList';
import {DownloadTask} from 'react-native-background-downloader';
import {PageHeader} from '../components/PageHeader';
import {ListEmpty} from '../components/ListEmpty';
import {ActiveDownloadItem} from './ActiveDownloadItem';
import {useDownloads} from '../services/pin-hooks';

export const ActiveDownloads: React.FC = () => {
	const downloads = useDownloads();
	const getItemLayout = React.useMemo(() => commonItemLayout(65), []);
	const keyExtractor = (item: DownloadTask): string => item.id;
	const renderItem = useCallback(({item}: { item: DownloadTask }): JSX.Element => (<ActiveDownloadItem item={item}/>), []);
	const ListHeaderComponent = (<PageHeader title="Active Downloads" subtitle="Pinned Media" titleIcon="download"/>);
	return (
		<FlatList
			data={downloads}
			key="downloads"
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			ListEmptyComponent={<ListEmpty list={downloads}/>}
			ListHeaderComponent={ListHeaderComponent}
			ItemSeparatorComponent={Separator}
			getItemLayout={getItemLayout}
		/>
	);
};
