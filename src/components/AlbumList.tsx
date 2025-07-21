import React, { useEffect, useState } from 'react';
import { BaseEntryListList, BaseEntryListListQuery } from './BaseEntryListList';
import { AlbumType, ListType } from '../services/jam';
import { getAlbumTypeInfos } from '../services/jam-lists';
import { useLazyAlbumListQuery } from '../services/queries/albumList';
import { RouteLink } from '../navigators/Routes';

export const AlbumList: React.FC<{ query: { listType?: ListType; albumType?: AlbumType; goLeft?: RouteLink; goRight?: RouteLink } }> = ({ query }) => {
	const [view, setView] = useState<BaseEntryListListQuery>({
		text: '',
		icon: 'album',
		albumTypes: [],
		useList: useLazyAlbumListQuery
	});

	useEffect(() => {
		const type = query?.albumType ? getAlbumTypeInfos(query?.albumType) : { title: 'Albums', icon: 'Album', albumType: undefined };
		setView({
			listType: query?.listType,
			text: type.title,
			icon: type.icon,
			goLeft: query?.goLeft,
			goRight: query?.goRight,
			albumTypes: type.albumType ? [type.albumType] : [],
			useList: useLazyAlbumListQuery
		});
	}, [query]);

	return (<BaseEntryListList query={view}/>);
};
