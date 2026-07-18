import React, { useMemo } from 'react';
import { BaseEntryListList, BaseEntryListListQuery } from './BaseEntryListList';
import { JamRouteLinks, RouteLink } from '../navigators/Routes';
import { AlbumType, ListType } from '../services/jam';
import { useLazyFolderListQuery } from '../services/queries/folderList';

export const FolderList: React.FC<{ query: { listType?: ListType; albumType?: AlbumType; goLeft?: RouteLink; goRight?: RouteLink } }> =
	({ query }) => {
		const view = useMemo<BaseEntryListListQuery>(() => {
			const info = JamRouteLinks.folders();
			return {
				listType: query?.listType,
				text: info.title,
				icon: info.icon,
				goLeft: query?.goLeft,
				goRight: query?.goRight,
				albumTypes: query?.albumType ? [query.albumType] : [],
				useList: useLazyFolderListQuery
			};
		}, [query]);

		return (<BaseEntryListList query={view} />);
	};
