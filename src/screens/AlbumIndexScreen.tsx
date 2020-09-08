import React, {useCallback, useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {getUrlTypeByID} from '../services/jam-lists';
import {useLazyAlbumIndexQuery} from '../services/queries/albumIndex';
import {ErrorView} from '../components/ErrorView';

export const AlbumIndexScreen: React.FC<HomeStackProps<HomeRoute.ALBUMS>> = ({route}) => {
	const [title, setTitle] = useState<string>('');
	const [titleIcon, setTitleIcon] = useState<string>('album');
	const [getIndex, {loading, error, called, index}] = useLazyAlbumIndexQuery();
	const albumTypeID = route?.params?.albumTypeID;
	const type = getUrlTypeByID(albumTypeID);

	useEffect(() => {
		if (type && type.albumType) {
			setTitle(type?.text || '');
			setTitleIcon(type?.icon || 'album');
		}
	}, [type]);

	useEffect(() => {
		if (type && type.albumType && !called) {
			getIndex([type.albumType]);
		}
	}, [type, called, getIndex]);

	const reload = useCallback((): void => {
		if (type && type.albumType) {
			getIndex([type.albumType], true);
		}
	}, [type, getIndex]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<IndexList
			index={index}
			title={title}
			titleIcon={titleIcon}
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};
