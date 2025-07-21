import React, { useCallback, useEffect } from 'react';
import { HomeRoute, HomeRouteProps } from '../navigators/Routing';
import { IndexList } from '../components/IndexList';
import { ErrorView } from '../components/ErrorView';
import { useLazyPodcastIndexQuery } from '../services/queries/podcastIndex';

export const PodcastIndexScreen: React.FC<HomeRouteProps<HomeRoute.PODCASTS>> = () => {
	const [getIndex, { loading, error, called, index }] = useLazyPodcastIndexQuery();

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
			title="Podcasts"
			called={called}
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};
