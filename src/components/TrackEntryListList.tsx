import React, {useCallback, useEffect, useState} from 'react';
import {ListTypeName} from '../services/jam-lists';
import {TrackEntry, useTrackListFunction} from '../services/types';
import {TrackEntryList, TrackEntryListInfo} from './TrackEntryList';
import {ListType} from '../services/jam';
import {ErrorView} from './ErrorView';
import dataService from '../services/data';
import {defaultListTrackDisplay, TrackDisplayFunction} from './TrackItem';
import {RouteLink} from '../navigators/Routes';

export interface TrackEntryListListQuery {
	listType?: ListType;
	genreIDs?: Array<string>;
	icon: string;
	text: string;
	subtitle?: string;
	useList: useTrackListFunction;
	goLeft?: RouteLink;
	goRight?: RouteLink;
}

export const TrackEntryListList: React.FC<{ query: TrackEntryListListQuery }> = ({query}) => {
	const [info, setInfo] = useState<TrackEntryListInfo>({
		title: '',
		subtitle: '',
		icon: ''
	});
	const [total, setTotal] = useState<number>(0);
	const [type, setType] = useState<{
		listType?: ListType;
		genreIDs?: Array<string>;
		displayFunc?: TrackDisplayFunction;
		seed?: string;
		offset: number;
	} | undefined>();
	const [entries, setEntries] = useState<Array<TrackEntry> | undefined>();
	const amount = 20;
	const [getList, {loading, error, data, queryID}] = query.useList();

	useEffect(() => {
		setInfo({icon: query.icon, title: query.text, subtitle: query.subtitle || ListTypeName[query.listType || '']});
		setType((prev) => {
			if (query.genreIDs) {
				const prev_genres = prev?.genreIDs ? prev.genreIDs.join('/') : '';
				const query_genres = query?.genreIDs ? query.genreIDs.join('/') : '';
				if (prev_genres === query_genres) {
					return prev;
				}
				setTotal(0);
				setEntries(undefined);
				return {genreIDs: query.genreIDs, offset: 0, displayFunc: defaultListTrackDisplay};
			} else {
				if (prev?.listType === query.listType) {
					return prev;
				}
				setTotal(0);
				setEntries(undefined);
				const seed = query.listType === ListType.random ? Date.now().toString() : undefined;
				return {listType: query.listType, seed, offset: 0, displayFunc: defaultListTrackDisplay};
			}
		});
	}, [query]);

	useEffect(() => {
		if (type && (type.genreIDs || type.listType)) {
			getList(type.listType, type.genreIDs || [], type.seed, amount, type.offset);
		}
	}, [type, getList]);

	useEffect(() => {
		if (data) {
			const items = data.items;
			setTotal(data.total);
			setEntries((prev) => {
				if (prev) {
					return prev.concat(items);
				}
				return items;
			});
		}
	}, [data]);

	const reload = useCallback((): void => {
		setEntries(undefined);
		setTotal(0);
		// TODO: this depends on ordering of graphql variables, FIXME
		const id = (queryID || '').slice(0, queryID?.indexOf('skip'));
		dataService.cache.removeKeyStartWith(id)
			.then(() => {
				setType((prev) => {
					const seed = prev?.listType === ListType.random ? Date.now().toString() : undefined;
					return {...prev, seed, offset: 0};
				});
			});
	}, [queryID]);

	const handleLoadMore = useCallback((): void => {
		if (!loading && entries && total > 0 && total > entries.length) {
			setType((prev) => {
				const p = prev?.offset || 0;
				if (p + amount > total) {
					return prev;
				}
				return {...prev, offset: p + amount};
			});
		}
	}, [entries, total, loading]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<TrackEntryList
			entries={entries}
			onRefresh={reload}
			onLoadMore={handleLoadMore}
			refreshing={loading}
			goLeft={query?.goLeft}
			goRight={query?.goRight}
			info={info}
			displayFunc={type?.displayFunc}
		/>
	);
};
