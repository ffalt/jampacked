import React, {useEffect, useState} from 'react';
import {ListType} from '../services/jam';
import {TrackEntryListList, TrackEntryListListQuery} from './TrackEntryListList';
import {useLazyTrackListQuery} from '../services/queries/trackList.hook';

export const TrackList: React.FC<{ query: { listType?: ListType } }> = ({query}) => {
	const [view, setView] = useState<TrackEntryListListQuery>({
		text: '',
		icon: 'track',
		useList: useLazyTrackListQuery
	});

	useEffect(() => {
		const type = {title: 'Tracks', icon: 'Track'};
		setView({
			listType: query?.listType,
			text: type.title,
			icon: type.icon,
			useList: useLazyTrackListQuery
		});
	}, [query]);

	return (<TrackEntryListList query={view}/>);
};
