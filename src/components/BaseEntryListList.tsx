import React, {useCallback, useEffect, useState} from 'react';
import {ListTypeName} from '../services/jam-lists';
import {BaseEntry, useListFunction} from '../services/types';
import {BaseEntryList, BaseEntryListInfo} from '../components/BaseEntryList';
import {AlbumType, ListType} from '../services/jam';
import {ErrorView} from './ErrorView';

export const BaseEntryListList: React.FC<{
	listType?: ListType;
	icon: string;
	text: string;
	albumTypes: Array<AlbumType>;
	useList: useListFunction
}> = ({listType, icon, text, albumTypes, useList}) => {
	const [info, setInfo] = useState<BaseEntryListInfo>({
		title: '',
		subtitle: '',
		icon: ''
	});
	const [total, setTotal] = useState<number>(0);
	const [offset, setOffset] = useState<number>(0);
	const [entries, setEntries] = useState<Array<BaseEntry> | undefined>();
	const amount = 10;
	const [getList, {loading, error, called, data}] = useList();

	useEffect(() => {
		setInfo({icon: icon, title: text, subtitle: ListTypeName[listType || '']});
		setOffset(0);
	}, [listType, icon, text]);

	useEffect(() => {
		if (listType) {
			getList(albumTypes, listType, amount, offset);
		}
	}, [albumTypes, listType, getList, offset]);

	useEffect(() => {
		if (data?.items?.length) {
			setTotal(data.total);
			setEntries((prev) => {
				return prev ? prev.concat(data?.items) : data?.items;
			});
		}
	}, [data]);

	const reload = useCallback((): void => {
		if (listType) {
			setEntries([]);
			setOffset(0);
			getList(albumTypes, listType, amount, offset, true);
		}
	}, [albumTypes, getList, listType, offset]);

	const handleLoadMore = useCallback((): void => {
		setOffset((prev => {
			if (prev + amount > total) {
				return prev;
			}
			return prev + amount;
		}));
	}, [total]);

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