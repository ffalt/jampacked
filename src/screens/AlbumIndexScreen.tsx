import React, {useCallback, useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {getUrlTypeByID} from '../services/jam-lists';
import {useLazyAlbumIndexQuery} from '../services/queries/albumIndex';
import {ErrorView} from '../components/ErrorView';
import {AlbumType} from '../services/jam';

export const AlbumIndexScreen: React.FC<HomeStackProps<HomeRoute.ALBUMS>> = ({route}) => {
	const [title, setTitle] = useState<string>('');
	const [titleIcon, setTitleIcon] = useState<string>('album');
	const [albumType, setAlbumType] = useState<AlbumType | undefined>();
	const [getIndex, {loading, error, called, index}] = useLazyAlbumIndexQuery();
	const type = getUrlTypeByID(route?.params?.albumUrlType);

	useEffect(() => {
		if (type?.albumType) {
			setTitle(type.text || '');
			setTitleIcon(type.icon || 'album');
			setAlbumType(type.albumType);
		}
	}, [type]);

	useEffect(() => {
		if (albumType) {
			getIndex([albumType]);
		}
	}, [albumType, getIndex]);

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
			called={called}
			onRefresh={reload}
		/>
	);
};
