import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { HttpLink } from '@apollo/client/link/http';
import { DataService } from './data';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client/errors';

const defaultOptions: ApolloClient.DefaultOptions = {
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

export type JamApolloClient = ApolloClient;

let client: JamApolloClient;

export async function initApolloClient(dataService: DataService): Promise<JamApolloClient> {
	const httpLink = new HttpLink({
		uri: (_): string => `${dataService.jam.auth.auth?.server}/graphql`,
		credentials: 'include'
	});

	const authLink = new SetContextLink((previousContext, _) => ({
		headers: {
			...previousContext.headers,
			authorization: dataService.jam.auth?.auth?.token ?
				`Bearer ${dataService.jam.auth?.auth?.token}` :
				previousContext.headers.authorization
		}
	}));

	const errorLink = new ErrorLink(({ error }) => {
		if (CombinedGraphQLErrors.is(error)) {
			for (const { message, locations, path } of error.errors) {
				console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
			}
		} else if (CombinedProtocolErrors.is(error)) {
			for (const { message, extensions } of error.errors) {
				console.log(`[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(extensions)}`);
			}
		} else {
			console.error(`[Network error]: ${error}`);
		}
	});

	const logLink = new ApolloLink((operation: any, forward: any) => {
		console.log('query', operation.operationName, operation.variables);
		return forward(operation).map((result: any) => result);
	});

	const cache = new InMemoryCache({ resultCaching: true });

	const authHttpLink = ApolloLink.from([authLink, httpLink]);
	const links: Array<ApolloLink> = logging ? [logLink, errorLink, authHttpLink] : [errorLink, authHttpLink];

	client = new ApolloClient({
		link: ApolloLink.from(links),
		cache,
		defaultOptions
	});
	return client;
}
