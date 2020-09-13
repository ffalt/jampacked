import React, {useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {BaseEntryListList} from '../components/BaseEntryListList';
import {AlbumType, ListType} from '../services/jam';
import {useLazySeriesListQuery} from '../services/queries/seriesList';
import {JamRouteLinks, RouteLink} from '../navigators/Routes';

export const SeriesListScreen: React.FC<HomeStackProps<HomeRoute.SERIESLIST>> = ({route}) => {
	const [view, setView] = useState<{ listType?: ListType; albumTypes: Array<AlbumType>; info: RouteLink }>({
		albumTypes: [],
		info: JamRouteLinks.series()
	});

	useEffect(() => {
		setView({
			listType: route?.params?.listType,
			albumTypes: route?.params?.albumType ? [route?.params?.albumType] : [],
			info: JamRouteLinks.series()
		});
	}, [route]);

	return (
		<BaseEntryListList
			text={view.info.title}
			icon={view.info.icon}
			listType={view.listType}
			albumTypes={view.albumTypes}
			useList={useLazySeriesListQuery}
		/>);
};
