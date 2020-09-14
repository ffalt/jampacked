import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AlbumsRoute, AlbumsRouteProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {ErrorView} from '../components/ErrorView';
import {getAlbumTypeInfos} from '../services/jam-lists';
import {AlbumsTabNavigatorContext} from '../navigators/AlbumsNavigatorContext';
import {useLazyAlbumIndexQuery} from '../services/queries/albumIndex.hook';

export const AlbumIndexScreen: React.FC<AlbumsRouteProps<AlbumsRoute.INDEX>> = () => {
	const [title, setTitle] = useState<string>('');
	const [titleIcon, setTitleIcon] = useState<string>('album');
	const [getIndex, {loading, error, called, index}] = useLazyAlbumIndexQuery();
	const {albumType} = useContext(AlbumsTabNavigatorContext);

	useEffect(() => {
		if (albumType) {
			const type = getAlbumTypeInfos(albumType);
			setTitle(type.title);
			setTitleIcon(type.icon);
		}
	}, [albumType]);

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
