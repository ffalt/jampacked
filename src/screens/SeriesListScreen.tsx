import React, {useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {BaseEntryListList} from '../components/BaseEntryListList';
import {AlbumType, ListType} from '../services/jam';
import {getUrlTypeByID} from '../services/jam-lists';
import {useLazySeriesListQuery} from '../services/queries/seriesList';

export const SeriesListScreen: React.FC<HomeStackProps<HomeRoute.SERIESLIST>> = ({route}) => {
	const [view, setView] = useState<{
		listType?: ListType;
		albumTypes: Array<AlbumType>;
		icon: string;
		text: string;
	}>({
		albumTypes: [],
		icon: '',
		text: ''
	});

	useEffect(() => {
		const listType = route?.params?.listType;
		const albumTypeID = route?.params?.albumTypeID;
		const type = getUrlTypeByID(albumTypeID);
		const text = 'Series';
		const icon = 'series';
		const albumTypes = type?.albumType ? [type.albumType] : [];
		setView({listType, text, icon, albumTypes});
	}, [route.params]);

	return (
		<BaseEntryListList
			text={view.text}
			icon={view.icon}
			listType={view.listType}
			albumTypes={view.albumTypes}
			useList={useLazySeriesListQuery}
		/>);
};
