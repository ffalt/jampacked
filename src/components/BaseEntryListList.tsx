import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ListTypeName } from '../utils/jam-lists.ts';
import { BaseEntryList, BaseEntryListInfo } from './BaseEntryList';
import { AlbumType, ListType } from '../services/jam';
import { ErrorView } from './ErrorView';
import { RouteLink } from '../navigators/Routes';
import { BaseEntry } from '../types/base.ts';
import { useListFunction } from '../types/use-list.ts';
import cacheService from '../services/cache.service.ts';

export interface BaseEntryListListQuery {
	icon: string;
	text: string;
	subtitle?: string;
	listType?: ListType;
	albumTypes?: Array<AlbumType>;
	genreIDs?: Array<string>;
	useList: useListFunction;
	goLeft?: RouteLink;
	goRight?: RouteLink;
}

export const BaseEntryListList: React.FC<{ query: BaseEntryListListQuery }> = ({ query }) => {
	const amount = 20;
	const [getList, { loading, error, data, queryID }] = query.useList();

	const info = useMemo<BaseEntryListInfo>(() => ({ icon: query.icon, title: query.text, subtitle: query.subtitle ?? ListTypeName[query.listType ?? ''] }), [query]);

	const buildType = (source: BaseEntryListListQuery): { listType?: ListType; seed?: string; albumTypes?: Array<AlbumType>; genreIDs?: Array<string>; offset: number } => {
		if (source.genreIDs) {
			return { genreIDs: source.genreIDs, albumTypes: source.albumTypes, offset: 0 };
		}
		const seed = source.listType === ListType.random ? Date.now().toString() : undefined;
		return { listType: source.listType, albumTypes: source.albumTypes, genreIDs: source.genreIDs, seed, offset: 0 };
	};

	const queryKey = query.genreIDs ? `g:${query.genreIDs.join('/')}` : `l:${query.listType ?? ''}`;
	const [type, setType] = useState(() => buildType(query));
	const [total, setTotal] = useState<number>(0);
	const [entries, setEntries] = useState<Array<BaseEntry> | undefined>();
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
		if (type.listType || (type.genreIDs && type.genreIDs.length > 0)) {
			getList(type.albumTypes ?? [], type.listType, type.genreIDs ?? [], type.seed, amount, type.offset);
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
		<BaseEntryList
			entries={entries}
			onRefresh={reload}
			onLoadMore={handleLoadMore}
			refreshing={loading}
			goLeft={query.goLeft}
			goRight={query.goRight}
			info={info}
		/>
	);
};
