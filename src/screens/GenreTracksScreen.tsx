import React, {useContext, useEffect, useState} from 'react';
import {useLazyTrackListQuery} from '../services/queries/trackList';
import {TrackEntryListList, TrackEntryListListQuery} from '../components/TrackEntryListList';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {GenreTabNavigatorContext} from '../navigators/GenreNavigatorContext';

export const GenreTracksScreen: React.FC<HomeRouteProps<HomeRoute.GENRE>> = () => {
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
				useList: useLazyTrackListQuery
			});
		}
	}, [state]);

	return (<TrackEntryListList query={view}/>);
};
