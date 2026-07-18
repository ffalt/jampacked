import React, { useMemo } from 'react';
import { BaseEntryListList, BaseEntryListListQuery } from './BaseEntryListList';
import { JamRouteLinks, RouteLink } from '../navigators/Routes';
import { AlbumType, ListType } from '../services/jam';
import { useLazySeriesListQuery } from '../services/queries/seriesList';

export const SeriesList: React.FC<{ query: { listType?: ListType; albumType?: AlbumType; goLeft?: RouteLink; goRight?: RouteLink } }> = ({ query }) => {
	const view = useMemo<BaseEntryListListQuery>(() => {
		const info = JamRouteLinks.series();
		return {
			listType: query?.listType,
			text: info.title,
			icon: info.icon,
			goLeft: query?.goLeft,
			goRight: query?.goRight,
			albumTypes: query?.albumType ? [query.albumType] : [],
			useList: useLazySeriesListQuery
		};
	}, [query]);

	return (<BaseEntryListList query={view} />);
};
