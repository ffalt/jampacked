import React, {useContext} from 'react';
import {AlbumsRoute, AlbumsRouteProps} from '../navigators/Routing';
import {ListType} from '../services/jam';
import {AlbumList} from '../components/AlbumList';
import {AlbumsTabNavigatorContext} from '../navigators/AlbumsNavigatorContext';
import {JamRouteLinks} from '../navigators/Routes';

export const AlbumListFavScreen: React.FC<AlbumsRouteProps<AlbumsRoute.FAV>> = () => {
	const state = useContext(AlbumsTabNavigatorContext);
	return (<AlbumList
		query={{
			listType: ListType.faved,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.albums(state?.albumType),
			goRight: JamRouteLinks.albumlist(ListType.recent, state?.albumType)
		}}
	/>);
};

export const AlbumListRecentScreen: React.FC<AlbumsRouteProps<AlbumsRoute.RECENT>> = () => {
	const state = useContext(AlbumsTabNavigatorContext);
	return (<AlbumList
		query={{
			listType: ListType.recent,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.albumlist(ListType.faved, state?.albumType),
			goRight: JamRouteLinks.albumlist(ListType.frequent, state?.albumType)
		}}
	/>);
};

export const AlbumListFrequentScreen: React.FC<AlbumsRouteProps<AlbumsRoute.FREQUENT>> = () => {
	const state = useContext(AlbumsTabNavigatorContext);
	return (<AlbumList
		query={{
			listType: ListType.frequent,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.albumlist(ListType.recent, state?.albumType),
			goRight: JamRouteLinks.albumlist(ListType.random, state?.albumType)
		}}
	/>);
};

export const AlbumListRandomScreen: React.FC<AlbumsRouteProps<AlbumsRoute.RANDOM>> = () => {
	const state = useContext(AlbumsTabNavigatorContext);
	return (<AlbumList
		query={{
			listType: ListType.random,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.albumlist(ListType.frequent, state?.albumType),
			goRight: JamRouteLinks.albumlist(ListType.highest, state?.albumType)
		}}
	/>);
};

export const AlbumListHighestScreen: React.FC<AlbumsRouteProps<AlbumsRoute.HIGHEST>> = () => {
	const state = useContext(AlbumsTabNavigatorContext);
	return (<AlbumList
		query={{
			listType: ListType.highest,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.albumlist(ListType.random, state?.albumType),
			goRight: JamRouteLinks.albumlist(ListType.avghighest, state?.albumType)
		}}
	/>);
};

export const AlbumListAvgHighestScreen: React.FC<AlbumsRouteProps<AlbumsRoute.AVGHIGHEST>> = () => {
	const state = useContext(AlbumsTabNavigatorContext);
	return (<AlbumList
		query={{
			listType: ListType.avghighest,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.albumlist(ListType.highest, state?.albumType)
		}}
	/>);
};
