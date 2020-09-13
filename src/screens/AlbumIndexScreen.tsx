import React, {useCallback, useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazyAlbumIndexQuery} from '../services/queries/albumIndex';
import {ErrorView} from '../components/ErrorView';
import {AlbumType} from '../services/jam';
import {getAlbumTypeInfos} from '../services/jam-lists';

export const AlbumIndexScreen: React.FC<HomeStackProps<HomeRoute.ALBUMS>> = ({route}) => {
	const [title, setTitle] = useState<string>('');
	const [titleIcon, setTitleIcon] = useState<string>('album');
	const [albumType, setAlbumType] = useState<AlbumType | undefined>();
	const [getIndex, {loading, error, called, index}] = useLazyAlbumIndexQuery();

	useEffect(() => {
		if (route?.params?.albumType) {
			const type = getAlbumTypeInfos(route?.params?.albumType);
			setTitle(type.title);
			setTitleIcon(type.icon);
			setAlbumType(type.albumType);
		}
	}, [route]);

	useEffect(() => {
		if (albumType) {
			getIndex([albumType]);
		}
	}, [albumType, getIndex]);

	const reload = useCallback((): void => {
		if (albumType) {
			getIndex([albumType], true);
		}
	}, [albumType, getIndex]);

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
