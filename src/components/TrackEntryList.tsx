import React from 'react';
import {PageHeader} from './PageHeader';
import {TrackEntry} from '../services/types';
import {Tracks} from './Tracks';

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
}> = ({info, entries, refreshing, onRefresh, onLoadMore}) => {
	const ListHeaderComponent = (<PageHeader title={info.title} titleIcon={info.icon} subtitle={info.subtitle}/>);
	return (
		<Tracks tracks={entries} ListHeaderComponent={ListHeaderComponent} onLoadMore={onLoadMore} onRefresh={onRefresh} refreshing={refreshing} showArtist={true}/>
	);
};

