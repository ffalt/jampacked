import { ApolloClient, ApolloLink, InMemoryCache, type ErrorPolicy } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { HttpLink } from '@apollo/client/link/http';
import jamService from './jam.service.ts';

// Apollo Client 4 requires default options to be declared before they can be set.
// See https://www.apollographql.com/docs/react/data/typescript#declaring-default-options-for-type-safety
declare module '@apollo/client' {
	namespace ApolloClient {
		namespace DeclareDefaultOptions {
			interface WatchQuery {
				errorPolicy: ErrorPolicy;
			}
			interface Query {
				errorPolicy: ErrorPolicy;
			}
			interface Mutate {
				errorPolicy: ErrorPolicy;
			}
		}
	}

	// Opt into the "classic" signature style so hooks and client methods keep
	// accepting explicit generic arguments (`useLazyQuery<TData, TVariables>`).
	// Providing global `defaultOptions` would otherwise switch to "modern"
	// signatures, which forbid manually specified generics and break our
	// generic query/mutation wrappers.
	interface TypeOverrides {
		signatureStyle: 'classic';
	}
}

const defaultOptions: ApolloClient.DefaultOptions.Input = {
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
