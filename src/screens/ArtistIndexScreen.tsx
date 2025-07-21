import React, { useCallback, useEffect } from 'react';
import { AlbumType, ListType } from '../services/jam';
import { ArtistsRoute, ArtistsRouteProps } from '../navigators/Routing';
import { IndexList } from '../components/IndexList';
import { ErrorView } from '../components/ErrorView';
import { useLazyArtistIndexQuery } from '../services/queries/artistIndex';
import { JamRouteLinks } from '../navigators/Routes';

export const ArtistIndexScreen: React.FC<ArtistsRouteProps<ArtistsRoute.INDEX>> = () => {
	const [getIndex, { loading, error, called, index }] = useLazyArtistIndexQuery();

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
			called={called}
			refreshing={loading}
			onRefresh={reload}
			goRight={JamRouteLinks.artistlist(ListType.faved)}
		/>
	);
};
