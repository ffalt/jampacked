import React, {useCallback, useEffect} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazyPlaylistIndexQuery} from '../services/queries/playlistIndex';
import {ErrorView} from '../components/ErrorView';

export const PlaylistIndexScreen: React.FC<HomeStackProps<HomeRoute.PLAYLISTS>> = () => {
	const [getIndex, {loading, error, called, index}] = useLazyPlaylistIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex();
		}
	}, [getIndex, called]);

	const reload = useCallback((): void => {
		getIndex(true);
	}, [getIndex]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<IndexList
			index={index}
			title="Playlists"
			titleIcon="playlist"
			called={called}
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};
