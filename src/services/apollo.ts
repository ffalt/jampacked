import {ApolloClient, ApolloLink, DefaultOptions, InMemoryCache} from '@apollo/client';
import {HttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {DataService} from './data';
import {onError} from 'apollo-link-error';

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

const logging = false;

export type JamApolloClient = ApolloClient<unknown>;

let client: JamApolloClient;

export function apolloClient(): JamApolloClient {
	return client;
}

export async function initApolloClient(dataService: DataService): Promise<JamApolloClient> {

	const httpLink = new HttpLink({
		uri: (_): string => {
			return `${dataService.jam.auth.auth?.server}/graphql`;
		},
		credentials: 'include'
	}) as any as ApolloLink;

	const authLink = setContext((_, {headers}: any) => {
		return {
			headers: {
				...headers,
				authorization: dataService.jam.auth?.auth?.token ?
					`Bearer ${dataService.jam.auth?.auth?.token}` :
					headers.authorization
			}
		};
	}) as any as ApolloLink;

	const errorLink = onError(({graphQLErrors, networkError}) => {
		if (graphQLErrors) {
			graphQLErrors.map(({message, locations, path}) =>
				console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
			);
		}
		if (networkError) {
			console.error(`[Network error]: ${networkError}`);
		}
	}) as any as ApolloLink;

	const logLink = new ApolloLink((operation: any, forward: any) => {
		// eslint-disable-next-line no-console
		console.log('query', operation.operationName, operation.variables);
		return forward(operation).map((result: any) => {
			// console.log('stop', operation.operationName);
			return result;
		});
	});

	const cache = new InMemoryCache({addTypename: false});

	const authHttpLink = ApolloLink.concat(authLink, httpLink);
	const links: Array<ApolloLink> = logging ? [logLink, errorLink, authHttpLink] : [errorLink, authHttpLink];

	client = new ApolloClient<unknown>({
		link: ApolloLink.from(links),
		cache,
		defaultOptions
	});
	return client;
}
