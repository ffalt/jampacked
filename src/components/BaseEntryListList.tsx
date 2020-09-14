import React, {useCallback, useEffect, useState} from 'react';
import {ListTypeName} from '../services/jam-lists';
import {BaseEntry, useListFunction} from '../services/types';
import {BaseEntryList, BaseEntryListInfo} from '../components/BaseEntryList';
import {AlbumType, ListType} from '../services/jam';
import {ErrorView} from './ErrorView';
import dataService from '../services/data';

export interface BaseEntryListListQuery {
	listType?: ListType;
	icon: string;
	text: string;
	albumTypes: Array<AlbumType>;
	useList: useListFunction
}

export const BaseEntryListList: React.FC<{ query: BaseEntryListListQuery }> = ({query}) => {
	const [info, setInfo] = useState<BaseEntryListInfo>({
		title: '',
		subtitle: '',
		icon: ''
	});
	const [total, setTotal] = useState<number>(0);
	const [type, setType] = useState<{
		listType?: ListType,
		seed?: string,
		albumTypes?: Array<AlbumType>,
		offset: number
	} | undefined>();
	const [entries, setEntries] = useState<Array<BaseEntry> | undefined>();
	const amount = 10;
	const [getList, {loading, error, called, data, queryID}] = query.useList();

	useEffect(() => {
		setInfo({icon: query.icon, title: query.text, subtitle: ListTypeName[query.listType || '']});
		setType((prev) => {
			if (prev?.listType === query.listType) {
				return prev;
			}
			setTotal(0);
			setEntries(undefined);
			const seed = query.listType === ListType.random ? Date.now().toString() : undefined;
			return {listType: query.listType, albumTypes: query.albumTypes, seed, offset: 0};
		});
	}, [query]);

	useEffect(() => {
		if (type && type.listType) {
			getList(type.albumTypes || [], type.listType, type.seed, amount, type.offset);
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
		dataService.removeItemsKeyStartWith(id)
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
		<BaseEntryList
			entries={entries}
			onRefresh={reload}
			onLoadMore={handleLoadMore}
			refreshing={loading}
			called={called}
			info={info}
		/>);
};
