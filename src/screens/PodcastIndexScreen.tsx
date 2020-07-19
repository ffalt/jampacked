import React, {useCallback, useEffect} from 'react';
import {HomeRoute, HomeStackProps} from '../navigators/Routing';
import {IndexList} from '../components/IndexList';
import {useLazyPodcastIndexQuery} from '../services/queries/podcastIndex';
import {snackError} from '../services/snack';

export const PodcastIndexScreen: React.FC<HomeStackProps<HomeRoute.PODCASTS>> = () => {
	const [getIndex, {loading, error, called, index}] = useLazyPodcastIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex();
		}
	}, [getIndex, called]);

	if (error) {
		snackError(error);
	}

	const reload = useCallback((): void => {
		getIndex();
	}, [getIndex]);

	return (
		<IndexList
			index={index}
			title="Podcasts"
			titleIcon="podcast"
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};
