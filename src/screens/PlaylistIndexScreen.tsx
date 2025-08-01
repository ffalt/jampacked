import React, { useCallback, useEffect } from 'react';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { IndexList } from '../components/IndexList';
import { ErrorView } from '../components/ErrorView';
import { useLazyPlaylistIndexQuery } from '../services/queries/playlistIndex';

export const PlaylistIndexScreen: React.FC<HomeRouteProps<HomeRoute.PLAYLISTS>> = () => {
	const [getIndex, { loading, error, called, index }] = useLazyPlaylistIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex();
		}
	}, [getIndex, called]);

	const reload = useCallback((): void => {
		getIndex(true);
	}, [getIndex]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload} />);
	}

	return (
		<IndexList
			index={index}
			title="Playlists"
			called={called}
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};
