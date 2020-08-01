import React, {useCallback, useEffect} from 'react';
import {AlbumType} from '../services/jam';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazyArtistIndexQuery} from '../services/queries/artistIndex';
import {snackError} from '../services/snack';

export const ArtistIndexScreen: React.FC<HomeStackProps<HomeRoute.ARTISTS>> = () => {
	const [getIndex, {loading, error, called, index}] = useLazyArtistIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex([AlbumType.album]);
		}
	}, [getIndex, called]);

	if (error) {
		snackError(error);
	}

	const reload = useCallback((): void => {
		getIndex([AlbumType.album], true);
	}, [getIndex]);

	return (
		<IndexList
			index={index}
			title="Artists"
			titleIcon="artist"
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};
