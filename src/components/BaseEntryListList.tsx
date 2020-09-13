import React, {useCallback, useEffect, useState} from 'react';
import {ListTypeName} from '../services/jam-lists';
import {BaseEntry, useListFunction} from '../services/types';
import {BaseEntryList, BaseEntryListInfo} from '../components/BaseEntryList';
import {AlbumType, ListType} from '../services/jam';
import {ErrorView} from './ErrorView';

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
	const [type, setType] = useState<{ listType?: ListType, albumTypes?: Array<AlbumType>, offset: number } | undefined>();
	const [entries, setEntries] = useState<Array<BaseEntry> | undefined>();
	const amount = 10;
	const [getList, {loading, error, called, data}] = query.useList();

	useEffect(() => {
		setInfo({icon: query.icon, title: query.text, subtitle: ListTypeName[query.listType || '']});
		setType((prev) => {
			if (prev?.listType === query.listType) {
				return prev;
			}
			setEntries(undefined);
			return {listType: query.listType, albumTypes: query.albumTypes, offset: 0};
		});
	}, [query]);

	useEffect(() => {
		if (type && type.listType) {
			getList(type.albumTypes || [], type.listType, amount, type.offset);
		}
	}, [type, getList]);

	useEffect(() => {
		if (data) {
			setTotal(data.total);
			setEntries((prev) => {
				return prev ? prev.concat(data?.items) : data?.items;
			});
		} else {
			setTotal(0);
			setEntries(undefined);
		}
	}, [data]);

	const reload = useCallback((): void => {
		setEntries(undefined);
		setTotal(0);
		setType((prev) => {
			return {...prev, offset: 0};
		});
	}, []);

	const handleLoadMore = useCallback((): void => {
		if (entries && total > 0 && total > entries.length) {
			setType((prev) => {
				const p = prev?.offset || 0;
				if (p + amount > total) {
					return prev;
				}
				return {...prev, offset: p + amount};
			});
		}
	}, [entries, total]);

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
