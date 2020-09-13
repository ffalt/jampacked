import React, {useCallback, useEffect} from 'react';
import {HomeRoute, HomeRouteProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazySeriesIndexQuery} from '../services/queries/seriesIndex';
import {ErrorView} from '../components/ErrorView';

export const SeriesIndexScreen: React.FC<HomeRouteProps<HomeRoute.SERIES>> = () => {
	const [getIndex, {loading, error, called, index}] = useLazySeriesIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex();
		}
	}, [getIndex, called]);

	const reload = useCallback((): void => {
		getIndex(true);
	}, [getIndex]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload}/>);
	}

	return (
		<IndexList
			index={index}
			title="Series"
			titleIcon="series"
			refreshing={loading}
			called={called}
			onRefresh={reload}
		/>
	);
};
