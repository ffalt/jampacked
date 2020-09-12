import React, {useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {useLazyAlbumListQuery} from '../services/queries/albumList';
import {BaseEntryListList} from '../components/BaseEntryListList';
import {AlbumType, ListType} from '../services/jam';
import {getUrlTypeByID} from '../services/jam-lists';

export const AlbumListScreen: React.FC<HomeStackProps<HomeRoute.ALBUMLIST>> = ({route}) => {
	const [view, setView] = useState<{
		listType?: ListType;
		albumTypes: Array<AlbumType>;
		icon: string;
		text: string;
	}>({albumTypes: [], icon: '', text: ''});

	useEffect(() => {
		const type = getUrlTypeByID(route?.params?.albumUrlType);
		setView({
			listType: route?.params?.listType,
			text: type?.text || 'Albums',
			icon: type?.text || 'album',
			albumTypes: type?.albumType ? [type.albumType] : []
		});
	}, [route.params]);

	return (
		<BaseEntryListList
			text={view.text}
			icon={view.icon}
			listType={view.listType}
			albumTypes={view.albumTypes}
			useList={useLazyAlbumListQuery}
		/>);
};
