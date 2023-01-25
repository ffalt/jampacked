import React from 'react';
import {PageHeader} from './PageHeader';
import {TrackEntry} from '../services/types';
import {Tracks} from './Tracks';
import {TrackDisplayFunction} from './TrackItem';
import {RouteLink} from '../navigators/Routes';

export interface TrackEntryListInfo {
	title: string;
	subtitle: string;
	icon: string;
}

export const TrackEntryList: React.FC<{
	entries?: Array<TrackEntry>;
	info: TrackEntryListInfo;
	refreshing: boolean;
	onRefresh: () => void;
	onLoadMore: () => void;
	goLeft?: RouteLink,
	goRight?: RouteLink
	displayFunc?: TrackDisplayFunction;
}> = ({info, entries, refreshing, onRefresh, onLoadMore, displayFunc, goLeft, goRight}) => {
	const ListHeaderComponent = (<PageHeader title={info.title} goLeft={goLeft} goRight={goRight} subtitle={info.subtitle}/>);
	return (
		<Tracks tracks={entries} ListHeaderComponent={ListHeaderComponent} onLoadMore={onLoadMore} onRefresh={onRefresh} refreshing={refreshing} displayFunc={displayFunc}/>
	);
};

