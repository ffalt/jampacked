import React, { useContext, useEffect, useState } from 'react';
import { useLazyTrackListQuery } from '../services/queries/trackList';
import { TrackEntryListList, TrackEntryListListQuery } from '../components/TrackEntryListList';
import { GenreRoute, GenreRouteProps } from '../navigators/Routing';
import { GenreTabNavigatorContext } from '../navigators/GenreNavigatorContext';
import { JamRouteLinks } from '../navigators/Routes';

export const GenreTracksScreen: React.FC<GenreRouteProps<GenreRoute.TRACKS>> = () => {
	const state = useContext(GenreTabNavigatorContext);
	const [view, setView] = useState<TrackEntryListListQuery>({
		text: '',
		icon: 'track',
		genreIDs: [],
		useList: useLazyTrackListQuery
	});

	useEffect(() => {
		if (state && state.id) {
			setView({
				text: `${state.name}`,
				subtitle: 'Tracks in Genre',
				genreIDs: [state.id],
				icon: 'track',
				useList: useLazyTrackListQuery,
				goLeft: JamRouteLinks.genrealbums()
			});
		}
	}, [state]);

	return (<TrackEntryListList query={view}/>);
};
