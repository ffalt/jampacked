import {DocumentNode} from 'graphql';
import {LazyQueryHookOptions, QueryLazyOptions} from '@apollo/client/react/types/types';
import {useCallback, useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {ApolloError} from 'apollo-client';
import dataService from './data';
import {JamApolloClient} from './apollo';

export type QueryFunc<TVariables> = (options?: QueryLazyOptions<TVariables>, forceRefresh?: boolean) => void;
export type QueryHookData<TResult> = { loading: boolean, error?: ApolloError, data?: TResult, called: boolean, queryID?: string };

function buildID<TVariables>(query: DocumentNode, variables?: TVariables): string | undefined {
	const opDef = query.definitions.find(d => d.kind === 'OperationDefinition');
	if (opDef) {
		return (opDef as any).name.value + (variables ? JSON.stringify(variables) : '');
	}
}

export async function getCacheOrQuery<TData, TVariables, TResult>(
	client: JamApolloClient,
	query: DocumentNode,
	variables: TVariables,
	transform: (d?: TData, variables?: TVariables) => TResult | undefined,
): Promise<TResult | undefined> {
	const queryID = buildID<TVariables>(query, variables);
	if (queryID) {
		const cache = await dataService.cache.getData<TResult>(queryID);
		if (cache) {
			return cache;
		}
		const result = await client.query<TData>({query, variables});
		return transform(result?.data, variables);
	}
}

export function useCacheOrLazyQuery<TData, TVariables, TResult>(
	query: DocumentNode,
	transform: (d?: TData, variables?: TVariables) => TResult | undefined,
	options?: LazyQueryHookOptions<TData, TVariables>): [QueryFunc<TVariables>, QueryHookData<TResult>] {
	const [result, setResult] = useState<TResult | undefined>();
	const [id, setID] = useState<string | undefined>();
	const [queryData, setQueryData] = useState<any>();
	const [q, {loading, error, data, variables}] = useLazyQuery<TData, TVariables>(query, options);

	const execute = useCallback((queryOptions?: QueryLazyOptions<TVariables>, forceRefresh?: boolean): void => {
		const queryID = buildID<TVariables>(query, queryOptions?.variables);
		if (queryID) {
			setID(queryID);
			setResult(undefined);
			setQueryData(undefined);
			if (forceRefresh) {
				q(queryOptions);
			} else {
				dataService.cache.getData<TResult>(queryID).then(r => {
					if (r) {
						setResult(r);
					} else {
						q(queryOptions);
					}
				});
			}
		}
	}, [query, q]);

	useEffect(() => {
		if (data) {
			setQueryData(data);
		}
	}, [data]);

	useEffect(() => {
		if (queryData) {
			const r = transform(queryData, variables);
			if (id && r) {
				setResult(r);
				dataService.cache.setData(id, r);
			}
		}
	}, [variables, id, transform, queryData]);

	return [execute, {loading, error, data: result, called: !!id, queryID: id}];
}
