import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import dataService from './data';
import {CachePersistor} from 'apollo-cache-persist';

const httpLink = createHttpLink({
	uri: (_) => {
		return `${dataService.jam.auth.auth?.server}/graphql`;
	},
	credentials: 'include'
});

const authLink = setContext((_, {headers}: any) => {
	return {
		headers: {
			...headers,
			authorization: dataService.jam.auth?.auth?.token ?
				`Bearer ${dataService.jam.auth?.auth?.token}` :
				headers.authorization
		}
	};
});

const cache = new InMemoryCache({addTypename: false});

const persistor = new CachePersistor({
	cache,
	storage: dataService,
	serialize: false,
	debug: true
});

export async function initApolloClient(): Promise<ApolloClient<any>> {
	await persistor.purge();
	await persistor.restore();
	return new ApolloClient({
		link: authLink.concat(httpLink),
		cache
	});

}
