import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ListTypeName } from '../utils/jam-lists.ts';
import { TrackEntryList, TrackEntryListInfo } from './TrackEntryList';
import { ListType } from '../services/jam';
import { ErrorView } from './ErrorView';
import { defaultListTrackDisplay, TrackDisplayFunction } from './TrackItem';
import { RouteLink } from '../navigators/Routes';
import { TrackEntry } from '../types/track.ts';
import { useTrackListFunction } from '../types/use-track-list.ts';
import cacheService from '../services/cache.service.ts';

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

export const TrackEntryListList: React.FC<{ query: TrackEntryListListQuery }> = ({ query }) => {
	const amount = 20;
	const [getList, { loading, error, data, queryID }] = query.useList();

	const info = useMemo<TrackEntryListInfo>(() => ({ icon: query.icon, title: query.text, subtitle: query.subtitle ?? ListTypeName[query.listType ?? ''] }), [query]);

	const buildType = (source: TrackEntryListListQuery): { listType?: ListType; genreIDs?: Array<string>; displayFunc?: TrackDisplayFunction; seed?: string; offset: number } => {
		if (source.genreIDs) {
			return { genreIDs: source.genreIDs, offset: 0, displayFunc: defaultListTrackDisplay };
		}
		const seed = source.listType === ListType.random ? Date.now().toString() : undefined;
		return { listType: source.listType, seed, offset: 0, displayFunc: defaultListTrackDisplay };
	};

	const queryKey = query.genreIDs ? `g:${query.genreIDs.join('/')}` : `l:${query.listType ?? ''}`;
	const [type, setType] = useState(() => buildType(query));
	const [total, setTotal] = useState<number>(0);
	const [entries, setEntries] = useState<Array<TrackEntry> | undefined>();
	const [previousKey, setPreviousKey] = useState(queryKey);
	const [previousData, setPreviousData] = useState(data);

	if (queryKey !== previousKey) {
		setPreviousKey(queryKey);
		setTotal(0);
		setEntries(undefined);
		setType(buildType(query));
	}

	if (data && data !== previousData) {
		setPreviousData(data);
		const items = data.items;
		setTotal(data.total);
		setEntries(previous => (previous ? [...previous, ...items] : items));
	}

	useEffect(() => {
		if (type.genreIDs || type.listType) {
			getList(type.listType, type.genreIDs ?? [], type.seed, amount, type.offset);
		}
	}, [type, getList]);

	const reload = useCallback((): void => {
		setEntries(undefined);
		setTotal(0);
		// TODO: this depends on ordering of graphql variables
		const id = (queryID ?? '').slice(0, queryID?.indexOf('skip'));
		cacheService.removeKeyStartWith(id)
			.then(() => {
				setType(previous => {
					const seed = previous?.listType === ListType.random ? Date.now().toString() : undefined;
					return { ...previous, seed, offset: 0 };
				});
			})
			.catch(console.error);
	}, [queryID]);

	const handleLoadMore = useCallback((): void => {
		if (!loading && entries && total > 0 && total > entries.length) {
			setType(previous => {
				const p = previous?.offset ?? 0;
				if (p + amount > total) {
					return previous;
				}
				return { ...previous, offset: p + amount };
			});
		}
	}, [entries, total, loading]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload} />);
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
			displayFunc={type.displayFunc}
		/>
	);
};
