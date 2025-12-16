import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { AlbumsRoute, AlbumsRouteProps } from '../navigators/Routing';
import { IndexList } from '../components/IndexList';
import { ErrorView } from '../components/ErrorView';
import { getAlbumTypeInfos } from '../utils/jam-lists.ts';
import { AlbumsTabNavigatorContext } from '../navigators/AlbumsNavigatorContext';
import { useLazyAlbumIndexQuery } from '../services/queries/albumIndex';
import { ListType } from '../services/jam';
import { JamRouteLinks } from '../navigators/Routes';

export const AlbumIndexScreen: React.FC<AlbumsRouteProps<AlbumsRoute.INDEX>> = () => {
	const [getIndex, { loading, error, called, index }] = useLazyAlbumIndexQuery();
	const { albumType } = useContext(AlbumsTabNavigatorContext);
	const title = useMemo(() => (albumType ? getAlbumTypeInfos(albumType).title : ''), [albumType]);

	useEffect(() => {
		if (albumType) {
			getIndex([albumType]);
		}
	}, [albumType, getIndex]);

	const reload = useCallback((): void => {
		if (albumType) {
			getIndex([albumType], true);
		}
	}, [albumType, getIndex]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload} />);
	}

	return (
		<IndexList
			index={index}
			title={title}
			refreshing={loading}
			called={called}
			onRefresh={reload}
			goRight={JamRouteLinks.albumlist(ListType.faved, albumType)}
		/>
	);
};
