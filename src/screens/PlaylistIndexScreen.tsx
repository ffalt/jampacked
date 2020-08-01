import React, {useCallback, useEffect} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazyPlaylistIndexQuery} from '../services/queries/playlistIndex';
import {snackError} from '../services/snack';

export const PlaylistIndexScreen: React.FC<HomeStackProps<HomeRoute.PLAYLISTS>> = () => {
	const [getIndex, {loading, error, called, index}] = useLazyPlaylistIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex();
		}
	}, [getIndex, called]);

	if (error) {
		snackError(error);
	}

	const reload = useCallback((): void => {
		getIndex(true);
	}, [getIndex]);

	return (
		<IndexList
			index={index}
			title="Playlists"
			titleIcon="playlist"
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};
