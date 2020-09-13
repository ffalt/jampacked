import React, {useEffect, useState} from 'react';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {BaseEntryListList, BaseEntryListListQuery} from '../components/BaseEntryListList';
import {useLazyFolderListQuery} from '../services/queries/folderList';
import {JamRouteLinks} from '../navigators/Routes';

export const FolderListScreen: React.FC<HomeRouteProps<HomeRoute.FOLDERLIST>> = ({route}) => {
	const [view, setView] = useState<BaseEntryListListQuery>({
		text: '',
		icon: 'folder',
		albumTypes: [],
		useList: useLazyFolderListQuery
	});

	useEffect(() => {
		const info = JamRouteLinks.artists();
		setView({
			listType: route?.params?.listType,
			text: info.title,
			icon: info.icon,
			albumTypes: route?.params?.albumType ? [route.params.albumType] : [],
			useList: useLazyFolderListQuery
		});
	}, [route]);

	return (<BaseEntryListList query={view}/>);
};
