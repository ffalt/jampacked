import {ApolloClient, DefaultOptions} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {InMemoryCache} from 'apollo-cache-inmemory';
import dataService from './data';
import {ApolloLink} from 'apollo-link';

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

const logLink = new ApolloLink((operation: any, forward: any) => {
	console.log('start', operation.operationName, operation.variables);
	return forward(operation).map((result: any) => {
		console.log('stop', operation.operationName);
		return result;
	});
});

const cache = new InMemoryCache({addTypename: false});

const defaultOptions: DefaultOptions = {
	watchQuery: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'ignore'
	},
	query: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'all'
	}
};

const logging = true;

const authHttpLink = authLink.concat(httpLink);
const link = logging ? ApolloLink.from([logLink, authHttpLink]) : authHttpLink;

export async function initApolloClient(): Promise<ApolloClient<any>> {
	return new ApolloClient({link, cache, defaultOptions});
}
