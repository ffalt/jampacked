import {DocumentNode} from 'graphql';
import {LazyQueryHookOptions, QueryLazyOptions} from '@apollo/client/react/types/types';
import {useCallback, useEffect, useState} from 'react';
import {useLazyQuery} from '@apollo/react-hooks';
import {ApolloError} from 'apollo-client';
import dataService from './data';
import {buildCacheID} from './cache-query';
import {CacheState} from './cache';

export type QueryFunc<TVariables> = (options?: QueryLazyOptions<TVariables>, forceRefresh?: boolean) => void;
export type QueryHookData<TResult> = { loading: boolean, error?: ApolloError, data?: TResult, called: boolean, queryID?: string };

export function useCacheOrLazyQuery<TData, TVariables, TResult>(
	query: DocumentNode,
	transform: (d?: TData, variables?: TVariables) => TResult | undefined,
	options?: LazyQueryHookOptions<TData, TVariables>): [QueryFunc<TVariables>, QueryHookData<TResult>] {
	const [result, setResult] = useState<TResult | undefined>();
	const [id, setID] = useState<string | undefined>();
	const [queryData, setQueryData] = useState<any>();
	const [q, {loading, error, data, variables}] = useLazyQuery<TData, TVariables>(query, options);

	const execute = useCallback((queryOptions?: QueryLazyOptions<TVariables>, forceRefresh?: boolean): void => {
		const queryID = buildCacheID<TVariables>(query, queryOptions?.variables);
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


export function useCacheManagement(): [fill: () => void, clear: () => void, stop: () => void, state: CacheState] {
	const [state, setState] = useState<CacheState>(dataService.cache.state);

	const fill = useCallback(() => {
		dataService.cache.fill();
	}, []);

	const clear = useCallback(() => {
		dataService.cache.clear();
	}, []);

	const stop = useCallback(() => {
		dataService.cache.stop();
	}, []);

	useEffect(() => {
		let isSubscribed = true;

		const update = (s: CacheState): void => {
			if (isSubscribed) {
				setState(s);
			}
		};

		dataService.cache.subscribeStateChangeUpdates(update);
		return (): void => {
			isSubscribed = false;
			dataService.cache.unsubscribeStateChangeUpdates(update);
		};
	}, []);

	return [fill, clear, stop, state];
}
