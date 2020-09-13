import React, {useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {useLazyAlbumListQuery} from '../services/queries/albumList';
import {BaseEntryListList} from '../components/BaseEntryListList';
import {AlbumType, ListType} from '../services/jam';
import {getAlbumTypeInfos} from '../services/jam-lists';

export const AlbumListScreen: React.FC<HomeStackProps<HomeRoute.ALBUMLIST>> = ({route}) => {
	const [view, setView] = useState<{
		listType?: ListType;
		title: string;
		icon: string;
		albumTypes: Array<AlbumType>;
	}>({
		title: '',
		icon: 'album',
		albumTypes: []
	});

	useEffect(() => {
		const type = route?.params?.albumType ? getAlbumTypeInfos(route?.params?.albumType) : {title: 'Albums', icon: 'Album', albumType: undefined};
		setView({
			listType: route?.params?.listType,
			title: type.title,
			icon: type.icon,
			albumTypes: type.albumType ? [type.albumType] : []
		});
	}, [route]);

	return (
		<BaseEntryListList
			text={view.title}
			icon={view.icon}
			listType={view.listType}
			albumTypes={view.albumTypes}
			useList={useLazyAlbumListQuery}
		/>);
};
