import React, { useMemo } from 'react';
import { BaseEntryListList, BaseEntryListListQuery } from './BaseEntryListList';
import { AlbumType, ListType } from '../services/jam';
import { getAlbumTypeInfos } from '../utils/jam-lists.ts';
import { useLazyAlbumListQuery } from '../services/queries/albumList';
import { RouteLink } from '../navigators/Routes';

export const AlbumList: React.FC<{ query: { listType?: ListType; albumType?: AlbumType; goLeft?: RouteLink; goRight?: RouteLink } }> = ({ query }) => {
	const view = useMemo<BaseEntryListListQuery>(() => {
		const type = query?.albumType ? getAlbumTypeInfos(query?.albumType) : { title: 'Albums', icon: 'Album', albumType: undefined };
		return {
			listType: query?.listType,
			text: type.title,
			icon: type.icon,
			goLeft: query?.goLeft,
			goRight: query?.goRight,
			albumTypes: type.albumType ? [type.albumType] : [],
			useList: useLazyAlbumListQuery
		};
	}, [query]);

	return (<BaseEntryListList query={view} />);
};
