import React, { useCallback, useEffect } from 'react';
import { GenresRoute, GenresRouteProps } from '../navigators/Routing';
import { IndexList } from '../components/IndexList';
import { ErrorView } from '../components/ErrorView';
import { useLazyGenreIndexQuery } from '../services/queries/genreIndex';

export const GenreIndexScreen: React.FC<GenresRouteProps<GenresRoute.INDEX>> = () => {
	const [getIndex, { loading, error, called, index }] = useLazyGenreIndexQuery();

	useEffect(() => {
		if (!called) {
			getIndex();
		}
	}, [getIndex, called]);

	const reload = useCallback((): void => {
		getIndex(true);
	}, [getIndex]);

	if (error) {
		return (<ErrorView error={error} onRetry={reload} />);
	}

	return (
		<IndexList
			index={index}
			title="Genres"
			called={called}
			refreshing={loading}
			onRefresh={reload}
		/>
	);
};
