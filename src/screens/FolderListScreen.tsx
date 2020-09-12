import React, {useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {BaseEntryListList} from '../components/BaseEntryListList';
import {AlbumType, ListType} from '../services/jam';
import {getUrlTypeByID} from '../services/jam-lists';
import {useLazyFolderListQuery} from '../services/queries/folderList';

export const FolderListScreen: React.FC<HomeStackProps<HomeRoute.FOLDERLIST>> = ({route}) => {
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
		const type = getUrlTypeByID(route?.params?.albumUrlType);
		const text = type?.text || 'Folders';
		const icon = type?.text || 'folder';
		const albumTypes = type?.albumType ? [type.albumType] : [];
		setView({listType, text, icon, albumTypes});
	}, [route.params]);

	return (
		<BaseEntryListList
			text={view.text}
			icon={view.icon}
			listType={view.listType}
			albumTypes={view.albumTypes}
			useList={useLazyFolderListQuery}
		/>);
};
