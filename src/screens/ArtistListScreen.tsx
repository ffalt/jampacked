import React, {useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {BaseEntryListList} from '../components/BaseEntryListList';
import {AlbumType, ListType} from '../services/jam';
import {useLazyArtistListQuery} from '../services/queries/artistList';
import {JamRouteLinks, RouteLink} from '../navigators/Routes';

export const ArtistListScreen: React.FC<HomeStackProps<HomeRoute.ARTISTLIST>> = ({route}) => {
	const [view, setView] = useState<{ listType?: ListType; albumTypes: Array<AlbumType>; info: RouteLink }>({
		albumTypes: [],
		info: JamRouteLinks.artists()
	});

	useEffect(() => {
		setView({
			listType: route?.params?.listType,
			albumTypes: route?.params?.albumType ? [route?.params?.albumType] : [],
			info: JamRouteLinks.artists()
		});
	}, [route]);

	return (
		<BaseEntryListList
			text={view.info.title}
			icon={view.info.icon}
			listType={view.listType}
			albumTypes={view.albumTypes}
			useList={useLazyArtistListQuery}
		/>);
};
