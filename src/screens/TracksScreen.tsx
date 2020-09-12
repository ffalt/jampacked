import React, {useCallback} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {PageHeader} from '../components/PageHeader';
import {FlatList, RefreshControl} from 'react-native';
import {Separator} from '../components/Separator';
import {trackEntryHeight, TrackItem} from '../components/TrackItem';
import {commonItemLayout} from '../components/AtoZList';
import {TrackEntry} from '../services/types';
import {useTheme} from '../style/theming';
import {ListEmpty} from '../components/ListEmpty';

export const TracksScreen: React.FC<HomeStackProps<HomeRoute.TRACKS>> = () => {
	const theme = useTheme();
	const tracks: Array<TrackEntry> | undefined = undefined;
	const refreshing = false;

	const reload = useCallback((): void => {
		// TODO: TracksScreen
	}, []);

	const keyExtractor = (item: TrackEntry): string => item.id;

	const renderItem = useCallback(({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item}/>), []);

	const renderHeader = useCallback((): JSX.Element => (<PageHeader title="Tracks" titleIcon="track"/>), []);

	const getItemLayout = React.useMemo(() => commonItemLayout(trackEntryHeight), []);

	return (
		<FlatList
			data={tracks || []}
			renderItem={renderItem}
			keyExtractor={keyExtractor}
			ItemSeparatorComponent={Separator}
			ListHeaderComponent={renderHeader}
			ListEmptyComponent={<ListEmpty list={tracks}/>}
			getItemLayout={getItemLayout}
			refreshControl={(
				<RefreshControl
					refreshing={refreshing}
					onRefresh={reload}
					progressViewOffset={80}
					progressBackgroundColor={theme.refreshCtrlBackground}
					colors={theme.refreshCtrlColors}
				/>
			)}
		/>
	);
};

