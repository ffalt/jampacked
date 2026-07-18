import React, { useMemo } from 'react';
import { ListType } from '../services/jam';
import { TrackEntryListList, TrackEntryListListQuery } from './TrackEntryListList';
import { useLazyTrackListQuery } from '../services/queries/trackList';
import { RouteLink } from '../navigators/Routes';

export const TrackList: React.FC<{ query: { listType?: ListType; goLeft?: RouteLink; goRight?: RouteLink } }> = ({ query }) => {
	const view = useMemo<TrackEntryListListQuery>(() => {
		const type = { title: 'Tracks', icon: 'Track' };
		return {
			listType: query?.listType,
			goLeft: query?.goLeft,
			goRight: query?.goRight,
			text: type.title,
			icon: type.icon,
			useList: useLazyTrackListQuery
		};
	}, [query]);

	return (<TrackEntryListList query={view} />);
};
