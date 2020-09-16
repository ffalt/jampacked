import React, {useCallback} from 'react';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {PageHeader} from '../components/PageHeader';
import {TrackItem} from '../components/TrackItem';
import {TrackEntry} from '../services/types';
import {DefaultFlatList} from '../components/DefFlatList';

export const TracksScreen: React.FC<HomeRouteProps<HomeRoute.TRACKS>> = () => {
	const tracks: Array<TrackEntry> | undefined = undefined;
	const loading = false;
	const error = undefined;

	const reload = useCallback((): void => {
		// TODO: TracksScreen
	}, []);

	const renderItem = useCallback(({item}: { item: TrackEntry }): JSX.Element => (<TrackItem track={item}/>), []);

	const ListHeaderComponent = useCallback((): JSX.Element => (<PageHeader title="Tracks" titleIcon="track"/>), []);

	return (
		<DefaultFlatList
			items={tracks}
			renderItem={renderItem}
			ListHeaderComponent={ListHeaderComponent}
			loading={loading}
			error={error}
			reload={reload}
		/>
	);
};

