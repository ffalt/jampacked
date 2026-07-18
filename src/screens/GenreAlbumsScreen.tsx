import React, { useContext, useMemo } from 'react';
import { BaseEntryListList, BaseEntryListListQuery } from '../components/BaseEntryListList';
import { useLazyAlbumListQuery } from '../services/queries/albumList';
import { GenreRoute, GenreRouteProps } from '../navigators/Routing';
import { GenreTabNavigatorContext } from '../navigators/GenreNavigatorContext';
import { JamRouteLinks } from '../navigators/Routes';

export const GenreAlbumsScreen: React.FC<GenreRouteProps<GenreRoute.ALBUMS>> = () => {
	const state = useContext(GenreTabNavigatorContext);
	const view = useMemo<BaseEntryListListQuery>(() => {
		if (!state?.id) {
			return {
				text: '',
				genreIDs: [],
				icon: 'album',
				useList: useLazyAlbumListQuery
			};
		}
		return {
			text: String(state.name),
			subtitle: 'Albums in Genre',
			genreIDs: [state.id],
			icon: 'album',
			useList: useLazyAlbumListQuery,
			goLeft: JamRouteLinks.genreartists(),
			goRight: JamRouteLinks.genretracks()
		};
	}, [state]);

	return (<BaseEntryListList query={view} />);
};
