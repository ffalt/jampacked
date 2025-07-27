import React, { useEffect, useState } from 'react';
import { BaseEntryListList, BaseEntryListListQuery } from './BaseEntryListList';
import { AlbumType, ListType } from '../services/jam';
import { JamRouteLinks, RouteLink } from '../navigators/Routes';
import { useLazyArtistListQuery } from '../services/queries/artistList';

export const ArtistList: React.FC<{ query: { listType?: ListType; albumType?: AlbumType; goLeft?: RouteLink; goRight?: RouteLink } }> = ({ query }) => {
	const [view, setView] = useState<BaseEntryListListQuery>({
		text: '',
		icon: 'artist',
		albumTypes: [],
		useList: useLazyArtistListQuery
	});

	useEffect(() => {
		const info = JamRouteLinks.artists();
		setView({
			listType: query?.listType,
			text: info.title,
			icon: info.icon,
			goLeft: query?.goLeft,
			goRight: query?.goRight,
			albumTypes: query?.albumType ? [query.albumType] : [],
			useList: useLazyArtistListQuery
		});
	}, [query]);

	return (<BaseEntryListList query={view} />);
};
