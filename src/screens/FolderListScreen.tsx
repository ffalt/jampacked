import React, {useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {BaseEntryListList} from '../components/BaseEntryListList';
import {AlbumType, ListType} from '../services/jam';
import {useLazyFolderListQuery} from '../services/queries/folderList';
import {JamRouteLinks, RouteLink} from '../navigators/Routes';

export const FolderListScreen: React.FC<HomeStackProps<HomeRoute.FOLDERLIST>> = ({route}) => {
	const [view, setView] = useState<{ listType?: ListType; albumTypes: Array<AlbumType>; info: RouteLink }>({
		albumTypes: [],
		info: JamRouteLinks.folders()
	});

	useEffect(() => {
		setView({
			listType: route?.params?.listType,
			albumTypes: route?.params?.albumType ? [route?.params?.albumType] : [],
			info: JamRouteLinks.folders()
		});
	}, [route]);

	return (
		<BaseEntryListList
			text={view.info.title}
			icon={view.info.icon}
			listType={view.listType}
			albumTypes={view.albumTypes}
			useList={useLazyFolderListQuery}
		/>);
};
