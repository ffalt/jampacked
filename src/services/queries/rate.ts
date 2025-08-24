import type { ErrorLike } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { RateResultDocument, RateResultQuery, RateResultQueryVariables, SetRateResultDocument, SetRateResultMutation, SetRateResultMutationVariables } from './rate.api';
import { MutationTuple, useLazyQuery, useMutation } from '@apollo/client/react';

function transformData(data: RateResultQuery | undefined): { rated?: number } {
	const value = data?.state?.rated;
	return { rated: value ?? undefined };
}

export const useLazyRateQuery = (): [(id: string) => void,
	{
		loading: boolean;
		error?: ErrorLike;
		rating?: { rated?: number };
		called: boolean;
		setRating: (rate: number) => void;
	}
] => {
	const [rate, setRate] = useState<{ rated?: number } | undefined>(undefined);
	const [query, { loading, error, called, data }] = useLazyQuery<RateResultQuery, RateResultQueryVariables>(RateResultDocument);

	useEffect(() => {
		setRate(transformData(data));
	}, [data]);

	const get = useCallback((id: string): void => {
		query({ variables: { id } }).catch(console.error);
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
			rating: rate,
			setRating
		}
	];
};

export const useRateMutation = (): MutationTuple<SetRateResultMutation, SetRateResultMutationVariables> =>
	useMutation<SetRateResultMutation, SetRateResultMutationVariables>(SetRateResultDocument);
