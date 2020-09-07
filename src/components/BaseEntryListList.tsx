import React, {useCallback, useEffect, useState} from 'react';
import {ListTypeName} from '../services/jam-lists';
import {BaseEntry, useListFunction} from '../services/types';
import {snackError} from '../services/snack';
import {BaseEntryList, BaseEntryListInfo} from '../components/BaseEntryList';
import {AlbumType, ListType} from '../services/jam';

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
	const [entries, setEntries] = useState<Array<BaseEntry>>([]);
	const amount = 10;
	const [getList, {loading, error, called, data}] = useList();

	useEffect(() => {
		setInfo({icon: icon, title: text, subtitle: ListTypeName[listType || '']});
		setOffset(0);
	}, [listType, icon, text]);

	useEffect(() => {
		if (listType && !called) {
			getList(albumTypes, listType, amount, offset);
		}
	}, [albumTypes, called, listType, getList, offset]);

	useEffect(() => {
		if (data?.items?.length) {
			setTotal(data.total);
			setEntries((prev) => {
				return prev.concat(data?.items);
			});
		}
	}, [data]);

	if (error) {
		snackError(error);
	}

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

	return (
		<BaseEntryList
			entries={entries}
			onRefresh={reload}
			onLoadMore={handleLoadMore}
			refreshing={loading}
			info={info}
		/>);
};
