import React, {useCallback} from 'react';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {PageHeader} from '../components/PageHeader';
import {FlatList, RefreshControl} from 'react-native';
import {Separator} from '../components/Separator';
import {TrackItem} from '../components/TrackItem';
import {TrackEntry} from '../services/types';
import {useTheme} from '../style/theming';
import {ListEmpty} from '../components/ListEmpty';
import {defaultItemLayout, defaultKeyExtractor} from '../utils/list.utils';

export const TracksScreen: React.FC<HomeRouteProps<HomeRoute.TRACKS>> = () => {
	const theme = useTheme();
	const tracks: Array<TrackEntry> | undefined = undefined;
	const refreshing = false;

	const reload = useCallback((): void => {
		// TODO: TracksScreen
	}, []);

	const renderItem = useCallback(({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item}/>), []);

	const ListHeaderComponent = useCallback((): JSX.Element => (<PageHeader title="Tracks" titleIcon="track"/>), []);

	return (
		<FlatList
			data={tracks || []}
			renderItem={renderItem}
			ListHeaderComponent={ListHeaderComponent}
			ListEmptyComponent={<ListEmpty list={tracks}/>}
			keyExtractor={defaultKeyExtractor}
			ItemSeparatorComponent={Separator}
			getItemLayout={defaultItemLayout}
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

