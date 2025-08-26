import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { HttpLink } from '@apollo/client/link/http';
import { DataService } from './data';

const defaultOptions: ApolloClient.DefaultOptions = {
	watchQuery: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'all'
	},
	query: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'all'
	},
	mutate: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'all'
	}
};

export type JamApolloClient = ApolloClient;

let client: JamApolloClient;

export async function initApolloClient(dataService: DataService): Promise<JamApolloClient> {
	const httpLink = new HttpLink({
		uri: (_): string => `${dataService.jam.auth.auth?.server}/graphql`,
		credentials: 'include'
	});

	const authLink = new SetContextLink((previousContext, _) => {
		const headers = {
			...previousContext.headers,
			authorization: dataService.jam.auth?.auth?.token ?
				`Bearer ${dataService.jam.auth?.auth?.token}` :
				(previousContext.headers as { authorization: string }).authorization
		} as Record<string, string>;
		return ({ headers });
	});

	const cache = new InMemoryCache({ resultCaching: true });

	client = new ApolloClient({
		link: ApolloLink.from([authLink, httpLink]),
		cache,
		defaultOptions
	});
	return client;
}
