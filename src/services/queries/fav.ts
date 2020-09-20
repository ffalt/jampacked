import gql from 'graphql-tag';
import {MutationTuple, useLazyQuery, useMutation} from '@apollo/react-hooks';
import {ApolloError} from 'apollo-client';
import {useCallback, useEffect, useState} from 'react';
import {FavResult, FavResultVariables} from './types/FavResult';
import {SetFavResult, SetFavResultVariables} from './types/SetFavResult';

const GET_FAV = gql`
    query FavResult($id: ID!) {
        state(id: $id) {
            id
            faved
        }
    }
`;

function transformData(data: FavResult | undefined): { timestamp?: number } {
	return {timestamp: data?.state?.faved ? (new Date(data.state.faved)).valueOf() : undefined};
}

export const useLazyFavQuery = (): [(id: string) => void,
	{
		loading: boolean,
		error?: ApolloError,
		faved?: { timestamp?: number },
		called: boolean,
		setFav: (fav: { timestamp?: number } | undefined) => void
	}
] => {
	const [faved, setFaved] = useState<{ timestamp?: number } | undefined>(undefined);
	const [query, {loading, error, called, data}] = useLazyQuery<FavResult, FavResultVariables>(GET_FAV);

	useEffect(() => {
		setFaved(transformData(data));
	}, [data]);

	const get = useCallback((id: string): void => {
		query({variables: {id}});
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

const SET_FAV = gql`
    mutation SetFavResult($id: ID!, $remove: Boolean) {
        fav(id: $id, remove: $remove ) {
            id
            faved
        }
    }
`;

export const useFavMutation = (): MutationTuple<SetFavResult, SetFavResultVariables> =>
	useMutation<SetFavResult, SetFavResultVariables>(SET_FAV);
