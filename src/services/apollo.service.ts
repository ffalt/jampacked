import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { HttpLink } from '@apollo/client/link/http';
import jamService from './jam.service.ts';

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

export class ApolloService {
	client!: ApolloClient;

	async init(): Promise<void> {
		const httpLink = new HttpLink({
			uri: (_): string => `${jamService.auth.auth?.server}/graphql`,
			credentials: 'include'
		});

		const authLink = new SetContextLink((previousContext, _) => {
			const headers = {
				...previousContext.headers,
				authorization: jamService.auth?.auth?.token ?
					`Bearer ${jamService.auth?.auth?.token}` :
					(previousContext.headers as { authorization: string }).authorization
			} as Record<string, string>;
			return ({ headers });
		});

		const cache = new InMemoryCache({ resultCaching: true });

		this.client = new ApolloClient({
			link: ApolloLink.from([authLink, httpLink]),
			cache,
			defaultOptions
		});
	}
}

const apolloService = new ApolloService();
export default apolloService;
