import React, {useContext} from 'react';
import {AlbumsRoute, AlbumsRouteProps} from '../navigators/Routing';
import {ListType} from '../services/jam';
import {AlbumList} from '../components/AlbumList';
import {AlbumsTabNavigatorContext} from '../navigators/AlbumsNavigatorContext';

const AlbumListScreen: React.FC<{ listType: ListType }> = ({listType}) => {
	const state = useContext(AlbumsTabNavigatorContext);
	return (<AlbumList query={{listType, albumType: state?.albumType}}/>);
};

export const AlbumListFavScreen: React.FC<AlbumsRouteProps<AlbumsRoute.FAV>> = () => {
	return (<AlbumListScreen listType={ListType.faved}/>);
};
export const AlbumListRecentScreen: React.FC<AlbumsRouteProps<AlbumsRoute.RECENT>> = () => {
	return (<AlbumListScreen listType={ListType.recent}/>);
};
export const AlbumListRandomScreen: React.FC<AlbumsRouteProps<AlbumsRoute.RANDOM>> = () => {
	return (<AlbumListScreen listType={ListType.random}/>);
};
export const AlbumListHighestScreen: React.FC<AlbumsRouteProps<AlbumsRoute.HIGHEST>> = () => {
	return (<AlbumListScreen listType={ListType.highest}/>);
};
export const AlbumListAvgHighestScreen: React.FC<AlbumsRouteProps<AlbumsRoute.AVGHIGHEST>> = () => {
	return (<AlbumListScreen listType={ListType.avghighest}/>);
};
export const AlbumListFrequentScreen: React.FC<AlbumsRouteProps<AlbumsRoute.FREQUENT>> = () => {
	return (<AlbumListScreen listType={ListType.frequent}/>);
};
