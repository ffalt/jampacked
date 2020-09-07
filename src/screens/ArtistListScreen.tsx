import React, {useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {BaseEntryListList} from '../components/BaseEntryListList';
import {AlbumType, ListType} from '../services/jam';
import {getUrlTypeByID} from '../services/jam-lists';
import {useLazyArtistListQuery} from '../services/queries/artistList';

export const ArtistListScreen: React.FC<HomeStackProps<HomeRoute.ARTISTLIST>> = ({route}) => {
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
		const text = type?.text || 'Artists';
		const icon = type?.text || 'artist';
		const albumTypes = type?.albumType ? [type.albumType] : [];
		setView({listType, text, icon, albumTypes});
	}, [route.params]);

	return (
		<BaseEntryListList
			text={view.text}
			icon={view.icon}
			listType={view.listType}
			albumTypes={view.albumTypes}
			useList={useLazyArtistListQuery}
		/>);
};
