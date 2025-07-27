import React, { useCallback, useEffect, useState } from 'react';
import { ListTypeName } from '../services/jam-lists';
import { BaseEntry, useListFunction } from '../services/types';
import { BaseEntryList, BaseEntryListInfo } from './BaseEntryList';
import { AlbumType, ListType } from '../services/jam';
import { ErrorView } from './ErrorView';
import dataService from '../services/data';
import { RouteLink } from '../navigators/Routes';

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
	const [info, setInfo] = useState<BaseEntryListInfo>({
		title: '',
		subtitle: '',
		icon: ''
	});
	const [total, setTotal] = useState<number>(0);
	const [type, setType] = useState<{
		listType?: ListType;
		seed?: string;
		albumTypes?: Array<AlbumType>;
		genreIDs?: Array<string>;
		offset: number;
	} | undefined>();
	const [entries, setEntries] = useState<Array<BaseEntry> | undefined>();
	const amount = 20;
	const [getList, { loading, error, data, queryID }] = query.useList();

	useEffect(() => {
		setInfo({ icon: query.icon, title: query.text, subtitle: query.subtitle || ListTypeName[query.listType || ''] });
		setType(previous => {
			if (query.genreIDs) {
				const previous_genres = previous?.genreIDs ? previous.genreIDs.join('/') : '';
				const query_genres = query?.genreIDs ? query.genreIDs.join('/') : '';
				if (previous_genres === query_genres) {
					return previous;
				}
				setTotal(0);
				setEntries(undefined);
				return { genreIDs: query.genreIDs, albumTypes: query.albumTypes, offset: 0 };
			} else {
				if (previous?.listType === query.listType) {
					return previous;
				}
				setTotal(0);
				setEntries(undefined);
				const seed = query.listType === ListType.random ? Date.now().toString() : undefined;
				return { listType: query.listType, albumTypes: query.albumTypes, genreIDs: query.genreIDs, seed, offset: 0 };
			}
		});
	}, [query]);

	useEffect(() => {
		if (type && (type.listType || (type.genreIDs && type.genreIDs.length > 0))) {
			getList(type.albumTypes || [], type.listType, type.genreIDs || [], type.seed, amount, type.offset);
		}
	}, [type, getList]);

	useEffect(() => {
		if (data) {
			const items = data.items;
			setTotal(data.total);
			setEntries(previous => {
				if (previous) {
					return [...previous, ...items];
				}
				return items;
			});
		}
	}, [data]);

	const reload = useCallback((): void => {
		setEntries(undefined);
		setTotal(0);
		// TODO: this depends on ordering of graphql variables
		const id = (queryID || '').slice(0, queryID?.indexOf('skip'));
		dataService.cache.removeKeyStartWith(id)
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
				const p = previous?.offset || 0;
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
