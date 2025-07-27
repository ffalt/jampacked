import React, { useContext } from 'react';
import { FoldersRoute, FoldersRouteProps } from '../navigators/Routing';
import { ListType } from '../services/jam';
import { FolderList } from '../components/FolderList';
import { FoldersTabNavigatorContext } from '../navigators/FoldersNavigatorContext';
import { JamRouteLinks } from '../navigators/Routes';

export const FolderListFavScreen: React.FC<FoldersRouteProps<FoldersRoute.FAV>> = () => {
	const state = useContext(FoldersTabNavigatorContext);
	return (
		<FolderList query={{
			listType: ListType.faved,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.folders(state?.albumType),
			goRight: JamRouteLinks.folderlist(ListType.recent, state?.albumType)
		}} />
	);
};

export const FolderListRecentScreen: React.FC<FoldersRouteProps<FoldersRoute.RECENT>> = () => {
	const state = useContext(FoldersTabNavigatorContext);
	return (
		<FolderList query={{
			listType: ListType.recent,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.folderlist(ListType.faved, state?.albumType),
			goRight: JamRouteLinks.folderlist(ListType.frequent, state?.albumType)
		}} />
	);
};

export const FolderListFrequentScreen: React.FC<FoldersRouteProps<FoldersRoute.FREQUENT>> = () => {
	const state = useContext(FoldersTabNavigatorContext);
	return (
		<FolderList query={{
			listType: ListType.frequent,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.folderlist(ListType.recent, state?.albumType),
			goRight: JamRouteLinks.folderlist(ListType.random, state?.albumType)
		}} />
	);
};

export const FolderListRandomScreen: React.FC<FoldersRouteProps<FoldersRoute.RANDOM>> = () => {
	const state = useContext(FoldersTabNavigatorContext);
	return (
		<FolderList query={{
			listType: ListType.random,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.folderlist(ListType.frequent, state?.albumType),
			goRight: JamRouteLinks.folderlist(ListType.highest, state?.albumType)
		}} />
	);
};

export const FolderListHighestScreen: React.FC<FoldersRouteProps<FoldersRoute.HIGHEST>> = () => {
	const state = useContext(FoldersTabNavigatorContext);
	return (
		<FolderList query={{
			listType: ListType.highest,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.folderlist(ListType.random, state?.albumType),
			goRight: JamRouteLinks.folderlist(ListType.avghighest, state?.albumType)
		}} />
	);
};

export const FolderListAvgHighestScreen: React.FC<FoldersRouteProps<FoldersRoute.AVGHIGHEST>> = () => {
	const state = useContext(FoldersTabNavigatorContext);
	return (
		<FolderList query={{
			listType: ListType.avghighest,
			albumType: state?.albumType,
			goLeft: JamRouteLinks.folderlist(ListType.highest, state?.albumType)
		}} />
	);
};
