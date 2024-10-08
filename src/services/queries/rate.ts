import { ApolloError, MutationTuple, useLazyQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { RateResultDocument, RateResultQuery, RateResultQueryVariables, SetRateResultDocument, SetRateResultMutation, SetRateResultMutationVariables } from './rate.api';

function transformData(data: RateResultQuery | undefined): { rated?: number } {
	const value = data?.state?.rated;
	return { rated: (value === null) ? undefined : value };
}

export const useLazyRateQuery = (): [(id: string) => void,
	{
		loading: boolean,
		error?: ApolloError,
		rating?: { rated?: number },
		called: boolean,
		setRating: (rate: number) => void
	}
] => {
	const [rating, setRate] = useState<{ rated?: number } | undefined>(undefined);
	const [query, { loading, error, called, data }] = useLazyQuery<RateResultQuery, RateResultQueryVariables>(RateResultDocument);

	useEffect(() => {
		setRate(transformData(data));
	}, [data]);

	const get = useCallback((id: string): void => {
		query({ variables: { id } });
	}, [query]);


	const setRating = useCallback((rate: number): void => {
		setRate({ rated: rate });
	}, []);

	return [
		get,
		{
			loading,
			called,
			error,
			rating,
			setRating
		}
	];
};

export const useRateMutation = (): MutationTuple<SetRateResultMutation, SetRateResultMutationVariables> =>
	useMutation<SetRateResultMutation, SetRateResultMutationVariables>(SetRateResultDocument);
