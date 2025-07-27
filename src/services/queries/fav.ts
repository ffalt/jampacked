import { ApolloError, MutationTuple, useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { FavResultDocument, FavResultQuery, FavResultQueryVariables, SetFavResultDocument, SetFavResultMutation, SetFavResultMutationVariables } from './fav.api';

function transformData(data: FavResultQuery | undefined): { timestamp?: number } {
	return { timestamp: data?.state?.faved ? (new Date(data.state.faved)).valueOf() : undefined };
}

export const useLazyFavQuery = (): [(id: string) => void,
	{
		loading: boolean;
		error?: ApolloError;
		faved?: { timestamp?: number };
		called: boolean;
		setFav: (fav: { timestamp?: number } | undefined) => void;
	}
] => {
	const [faved, setFaved] = useState<{ timestamp?: number } | undefined>(undefined);
	const [query, { loading, error, called, data }] = useLazyQuery<FavResultQuery, FavResultQueryVariables>(FavResultDocument);

	useEffect(() => {
		setFaved(transformData(data));
	}, [data]);

	const get = useCallback((id: string): void => {
		query({ variables: { id } }).catch(console.error);
	}, [query]);

	const setFav = useCallback((fav: { timestamp?: number } | undefined): void => {
		setFaved(fav);
	}, []);

	return [
		get,
		{
			loading,
			called,
			error,
			faved,
			setFav
		}
	];
};

export const useFavMutation = (): MutationTuple<SetFavResultMutation, SetFavResultMutationVariables> =>
	useMutation<SetFavResultMutation, SetFavResultMutationVariables>(SetFavResultDocument);
