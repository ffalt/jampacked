import React, {useContext, useEffect, useState} from 'react';
import {BaseEntryListList, BaseEntryListListQuery} from '../components/BaseEntryListList';
import {useLazyArtistListQuery} from '../services/queries/artistList.hook';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {GenreTabNavigatorContext} from '../navigators/GenreNavigatorContext';

export const GenreArtistsScreen: React.FC<HomeRouteProps<HomeRoute.GENRE>> = () => {
	const state = useContext(GenreTabNavigatorContext);
	const [view, setView] = useState<BaseEntryListListQuery>({
		text: '',
		genreIDs: [],
		icon: 'artist',
		useList: useLazyArtistListQuery
	});

	useEffect(() => {
		if (state && state.id) {
			setView({
				text: `${state.name}`,
				subtitle: 'Artists in Genre',
				genreIDs: [state.id],
				icon: 'artist',
				useList: useLazyArtistListQuery
			});
		}
	}, [state]);

	return (<BaseEntryListList query={view}/>);
};