import React, {useCallback, useEffect} from 'react';
import {AlbumType} from '../services/jam';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazyArtistIndexQuery} from '../services/queries/artistIndex';
import {ErrorView} from '../components/ErrorView';

export const ArtistIndexScreen: React.FC<HomeStackProps<HomeRoute.ARTISTS>> = () => {
	const [getIndex, {loading, error, called, index}] = useLazyArtistIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex([AlbumType.album]);
		}
	}, [getIndex, called]);

	const reload = useCallback((): void => {
		getIndex([AlbumType.album], true);
	}, [getIndex]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<IndexList
			index={index}
			title="Artists"
			titleIcon="artist"
			called={called}
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};
