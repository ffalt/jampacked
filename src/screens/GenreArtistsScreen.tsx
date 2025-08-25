import React, { useContext, useEffect, useState } from 'react';
import { BaseEntryListList, BaseEntryListListQuery } from '../components/BaseEntryListList';
import { useLazyArtistListQuery } from '../services/queries/artistList';
import { GenreRoute, GenreRouteProps } from '../navigators/Routing';
import { GenreTabNavigatorContext } from '../navigators/GenreNavigatorContext';
import { JamRouteLinks } from '../navigators/Routes';

export const GenreArtistsScreen: React.FC<GenreRouteProps<GenreRoute.ARTISTS>> = () => {
	const state = useContext(GenreTabNavigatorContext);
	const [view, setView] = useState<BaseEntryListListQuery>({
		text: '',
		genreIDs: [],
		icon: 'artist',
		useList: useLazyArtistListQuery
	});

	useEffect(() => {
		if (state?.id) {
			setView({
				text: `${state.name}`,
				subtitle: 'Artists in Genre',
				genreIDs: [state.id],
				icon: 'artist',
				useList: useLazyArtistListQuery,
				goRight: JamRouteLinks.genrealbums()
			});
		}
	}, [state]);

	return (<BaseEntryListList query={view} />);
};
