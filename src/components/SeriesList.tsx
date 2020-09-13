import React, {useEffect, useState} from 'react';
import {BaseEntryListList, BaseEntryListListQuery} from '../components/BaseEntryListList';
import {useLazySeriesListQuery} from '../services/queries/seriesList';
import {JamRouteLinks} from '../navigators/Routes';
import {AlbumType, ListType} from '../services/jam';

export const SeriesList: React.FC<{ query: { listType?: ListType; albumType?: AlbumType } }> = ({query}) => {
	const [view, setView] = useState<BaseEntryListListQuery>({
		text: '',
		icon: 'series',
		albumTypes: [],
		useList: useLazySeriesListQuery
	});

	useEffect(() => {
		const info = JamRouteLinks.series();
		setView({
			listType: query?.listType,
			text: info.title,
			icon: info.icon,
			albumTypes: query?.albumType ? [query.albumType] : [],
			useList: useLazySeriesListQuery
		});
	}, [query]);

	return (<BaseEntryListList query={view}/>);
};
