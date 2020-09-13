import React, {useEffect, useState} from 'react';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {BaseEntryListList, BaseEntryListListQuery} from '../components/BaseEntryListList';
import {useLazySeriesListQuery} from '../services/queries/seriesList';
import {JamRouteLinks} from '../navigators/Routes';

export const SeriesListScreen: React.FC<HomeRouteProps<HomeRoute.SERIESLIST>> = ({route}) => {
	const [view, setView] = useState<BaseEntryListListQuery>({
		text: '',
		icon: 'series',
		albumTypes: [],
		useList: useLazySeriesListQuery
	});

	useEffect(() => {
		const info = JamRouteLinks.series();
		setView({
			listType: route?.params?.listType,
			text: info.title,
			icon: info.icon,
			albumTypes: route?.params?.albumType ? [route.params.albumType] : [],
			useList: useLazySeriesListQuery
		});
	}, [route]);

	return (<BaseEntryListList query={view}/>);
};
