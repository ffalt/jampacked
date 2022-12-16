import React, {useContext, useEffect, useState} from 'react';
import {BaseEntryListList, BaseEntryListListQuery} from '../components/BaseEntryListList';
import {useLazyAlbumListQuery} from '../services/queries/albumList';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {GenreTabNavigatorContext} from '../navigators/GenreNavigatorContext';

export const GenreAlbumsScreen: React.FC<HomeRouteProps<HomeRoute.GENRE>> = () => {
	const state = useContext(GenreTabNavigatorContext);
	const [view, setView] = useState<BaseEntryListListQuery>({
		text: '',
		genreIDs: [],
		icon: 'album',
		useList: useLazyAlbumListQuery
	});

	useEffect(() => {
		if (state && state.id) {
			setView({
				text: `${state.name}`,
				subtitle: 'Albums in Genre',
				genreIDs: [state.id],
				icon: 'album',
				useList: useLazyAlbumListQuery
			});
		}
	}, [state]);

	return (<BaseEntryListList query={view}/>);
};
