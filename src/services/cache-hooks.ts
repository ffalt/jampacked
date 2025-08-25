import { useCallback, useEffect, useState } from 'react';
import dataService from './data';
import { buildCacheID } from './cache-query';
import { CacheState } from './cache';
import { DocumentNode } from 'graphql';
import { ErrorLike, type OperationVariables } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';

export type QueryFunction<TData, TVariables extends OperationVariables> = (variables: TVariables, options?: useLazyQuery.Options<TData, TVariables>, forceRefresh?: boolean) => void;

export interface QueryHookData<TResult> {
	loading: boolean;
	error?: ErrorLike;
	data?: TResult;
	called: boolean;
	queryID?: string;
}

export function useCacheOrLazyQuery<TData, TVariables extends OperationVariables, TResult>(
	query: DocumentNode,
	transform: (d?: TData, variables?: TVariables) => TResult | undefined,
	options?: useLazyQuery.Options<TData, TVariables>): [QueryFunction<TData, TVariables>, QueryHookData<TResult>] {
	const [result, setResult] = useState<TResult | undefined>();
	const [id, setID] = useState<string | undefined>();
	const [queryData, setQueryData] = useState<TData>();
	const [q, { loading, error, data, variables }] = useLazyQuery<TData, TVariables>(query, options);

	const execute = useCallback((variables: TVariables, queryOptions?: useLazyQuery.Options<TData, TVariables>, forceRefresh?: boolean): void => {
		const queryID = buildCacheID<TVariables>(query, variables);
		if (queryID) {
			setID(queryID);
			setResult(undefined);
			setQueryData(undefined);
			if (forceRefresh) {
				q({ variables, ...queryOptions }).catch(console.error);
			} else {
				dataService.cache.getData<TResult>(queryID)
					.then(async r => {
						if (r) {
							setResult(r);
						} else {
							await q({ variables, ...queryOptions });
						}
					})
					.catch(console.error);
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
			const r = transform(queryData, variables as TVariables);
			if (id && r) {
				setResult(r);
				dataService.cache.setData(id, r).catch(console.error);
			}
		}
	}, [variables, id, transform, queryData]);

	return [execute, { loading, error, data: result, called: !!id, queryID: id }];
}

export function useCacheManagement(): [fill: () => void, clear: () => void, stop: () => void, state: CacheState] {
	const [state, setState] = useState<CacheState>(dataService.cache.state);

	const fill = useCallback(() => {
		dataService.cache.fill().catch(console.error);
	}, []);

	const clear = useCallback(() => {
		dataService.cache.clear().catch(console.error);
	}, []);

	const stop = useCallback(() => {
		dataService.cache.stop().catch(console.error);
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
