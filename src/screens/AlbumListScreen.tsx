import React, {useCallback, useEffect, useState} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {getUrlTypeByID, ListTypeName} from '../services/jam-lists';
import {BaseEntry} from '../services/types';
import {useLazyAlbumListQuery} from '../services/queries/albumList';
import {snackError} from '../services/snack';
import {BaseEntryList, BaseEntryListInfo} from '../components/BaseEntryList';

export const AlbumListScreen: React.FC<HomeStackProps<HomeRoute.ALBUMLIST>> = ({route}) => {
	const [info, setInfo] = useState<BaseEntryListInfo>({
		title: '',
		subtitle: '',
		icon: 'album'
	});
	const [total, setTotal] = useState<number>(0);
	const [offset, setOffset] = useState<number>(0);
	const [entries, setEntries] = useState<Array<BaseEntry>>([]);
	const [getList, {loading, error, called, data}] = useLazyAlbumListQuery();
	const listType = route?.params?.listType;
	const albumTypeID = route?.params?.albumTypeID;
	const type = getUrlTypeByID(albumTypeID);
	const amount = 10;

	useEffect(() => {
		if (type) {
			setInfo({icon: type.icon || 'album', title: type.text || '', subtitle: ListTypeName[listType]});
		}
	}, [listType, type]);

	useEffect(() => {
		if (type && type.albumType && !called) {
			getList([type.albumType], listType, amount, offset);
		}
	}, [type, called, listType, getList, offset]);

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
		if (type && type.albumType) {
			setEntries([]);
			setOffset(0);
			getList([type.albumType], listType, amount, offset, true);
		}
	}, [type, getList, listType, offset]);

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
