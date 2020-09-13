import React, {useCallback, useContext, useEffect, useState} from 'react';
import {AlbumsRoute, AlbumsRouteProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazyAlbumIndexQuery} from '../services/queries/albumIndex';
import {ErrorView} from '../components/ErrorView';
import {AlbumType} from '../services/jam';
import {getAlbumTypeInfos} from '../services/jam-lists';
import {AlbumsTabNavigatorContext} from '../navigators/AlbumsNavigatorContext';

export const AlbumIndexScreen: React.FC<AlbumsRouteProps<AlbumsRoute.INDEX>> = () => {
	const [title, setTitle] = useState<string>('');
	const [titleIcon, setTitleIcon] = useState<string>('album');
	const [albumType, setAlbumType] = useState<AlbumType | undefined>();
	const [getIndex, {loading, error, called, index}] = useLazyAlbumIndexQuery();
	const state = useContext(AlbumsTabNavigatorContext);

	useEffect(() => {
		console.log('state', state);
		if (state?.albumType) {
			const type = getAlbumTypeInfos(state?.albumType);
			setTitle(type.title);
			setTitleIcon(type.icon);
			setAlbumType(type.albumType);
		}
	}, [state]);

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
