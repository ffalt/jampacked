import React, {useEffect, useState} from 'react';
import {BaseEntryListList, BaseEntryListListQuery} from './BaseEntryListList';
import {JamRouteLinks, RouteLink} from '../navigators/Routes';
import {AlbumType, ListType} from '../services/jam';
import {useLazyFolderListQuery} from '../services/queries/folderList';

export const FolderList: React.FC<{ query: { listType?: ListType; albumType?: AlbumType, goLeft?: RouteLink, goRight?: RouteLink } }> =
	({query}) => {
		const [view, setView] = useState<BaseEntryListListQuery>({
			text: '',
			icon: 'folder',
			albumTypes: [],
			useList: useLazyFolderListQuery
		});

		useEffect(() => {
			const info = JamRouteLinks.folders();
			setView({
				listType: query?.listType,
				text: info.title,
				icon: info.icon,
				goLeft: query?.goLeft,
				goRight: query?.goRight,
				albumTypes: query?.albumType ? [query.albumType] : [],
				useList: useLazyFolderListQuery
			});
		}, [query]);

		return (<BaseEntryListList query={view}/>);
	};
