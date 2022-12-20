import React, {useCallback, useEffect} from 'react';
import {SeriesRoute, SeriesRouteProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {ErrorView} from '../components/ErrorView';
import {useLazySeriesIndexQuery} from '../services/queries/seriesIndex';

export const SeriesIndexScreen: React.FC<SeriesRouteProps<SeriesRoute.INDEX>> = () => {
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
