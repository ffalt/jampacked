import React, {useContext} from 'react';
import {FoldersRoute, FoldersRouteProps} from '../navigators/Routing';
import {ListType} from '../services/jam';
import {FolderList} from '../components/FolderList';
import {FoldersTabNavigatorContext} from '../navigators/FoldersNavigatorContext';

const FolderListScreen: React.FC<{ listType: ListType }> = ({listType}) => {
	const state = useContext(FoldersTabNavigatorContext);
	return (<FolderList query={{listType, albumType: state?.albumType}}/>);
};

export const FolderListFavScreen: React.FC<FoldersRouteProps<FoldersRoute.FAV>> = () => {
	return (<FolderListScreen listType={ListType.faved}/>);
};
export const FolderListRecentScreen: React.FC<FoldersRouteProps<FoldersRoute.RECENT>> = () => {
	return (<FolderListScreen listType={ListType.recent}/>);
};
export const FolderListRandomScreen: React.FC<FoldersRouteProps<FoldersRoute.RANDOM>> = () => {
	return (<FolderListScreen listType={ListType.random}/>);
};
export const FolderListHighestScreen: React.FC<FoldersRouteProps<FoldersRoute.HIGHEST>> = () => {
	return (<FolderListScreen listType={ListType.highest}/>);
};
export const FolderListAvgHighestScreen: React.FC<FoldersRouteProps<FoldersRoute.AVGHIGHEST>> = () => {
	return (<FolderListScreen listType={ListType.avghighest}/>);
};
export const FolderListFrequentScreen: React.FC<FoldersRouteProps<FoldersRoute.FREQUENT>> = () => {
	return (<FolderListScreen listType={ListType.frequent}/>);
};
