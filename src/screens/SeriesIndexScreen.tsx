import React, {useCallback, useEffect} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazySeriesIndexQuery} from '../services/queries/seriesIndex';
import {snackError} from '../services/snack';

export const SeriesIndexScreen: React.FC<HomeStackProps<HomeRoute.SERIES>> = () => {
	const [getIndex, {loading, error, called, index}] = useLazySeriesIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex();
		}
	}, [getIndex, called]);

	if (error) {
		snackError(error);
	}

	const reload = useCallback((): void => {
		getIndex(true);
	}, [getIndex]);

	return (
		<IndexList
			index={index}
			title="Series"
			titleIcon="series"
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};
