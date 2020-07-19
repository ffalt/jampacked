import gql from 'graphql-tag';
import {useLazyQuery} from '@apollo/react-hooks';
import {JamObjectType} from '../jam';
import {ApolloError} from 'apollo-client';
import {useCallback, useEffect, useState} from 'react';
import {AutoCompleteData, AutoCompleteDataSection} from '../types';
import {AutocompleteResult, AutocompleteResultVariables} from './types/AutocompleteResult';

const GET_AUTOCOMPLETE = gql`
    query AutocompleteResult($query: String!) {
        albums(page:{take:5}, filter:{query:$query}) {
            total
            items {
                id
                name
            }
        }
        artists(page:{take:5}, filter:{query:$query}) {
            total
            items {
                id
                name
            }
        }
        serieses(page:{take:5}, filter:{query:$query}) {
            total
            items {
                id
                name
            }
        }
        podcasts(page:{take:5}, filter:{query:$query}) {
            total
            items {
                id
                name
            }
        }
        episodes(page:{take:5}, filter:{query:$query}) {
            total
            items {
                id
                name
            }
        }
        folders(page:{take:5}, filter:{query:$query}) {
            total
            items {
                id
                name
            }
        }
        playlists(page:{take:5}, filter:{query:$query}) {
            total
            items {
                id
                name
            }
        }
        tracks(page:{take:5}, filter:{query:$query}) {
            total
            items {
                id
                name
            }
        }
    }
`;

type Autocomplete = Array<AutoCompleteDataSection>;

function buildSection(key: string, objType: JamObjectType, page: { total: number; items: Array<{ id: string, name: string }> }): AutoCompleteDataSection {
	return {
		key,
		objType,
		total: page.total,
		data: page.items.map(entry => ({id: entry.id, name: entry.name, objType}))
	};
}

function transformData(data?: AutocompleteResult): Autocomplete {
	if (!data) {
		return [];
	}
	const sections: AutoCompleteData = [];
	if (data.albums && data.albums.items.length > 0) {
		sections.push(buildSection('Albums', JamObjectType.album, data.albums));
	}
	if (data.artists && data.artists.items.length > 0) {
		sections.push(buildSection('Artists', JamObjectType.artist, data.artists));
	}
	if (data.serieses && data.serieses.items.length > 0) {
		sections.push(buildSection('Series', JamObjectType.series, data.serieses));
	}
	if (data.podcasts && data.podcasts.items.length > 0) {
		sections.push(buildSection('Podcasts', JamObjectType.podcast, data.podcasts));
	}
	if (data.episodes && data.episodes.items.length > 0) {
		sections.push(buildSection('Podcast Episodes', JamObjectType.episode, data.episodes));
	}
	if (data.playlists && data.playlists.items.length > 0) {
		sections.push(buildSection('Playlists', JamObjectType.playlist, data.playlists));
	}
	if (data.folders && data.folders.items.length > 0) {
		sections.push(buildSection('Folders', JamObjectType.folder, data.folders));
	}
	if (data.tracks && data.tracks.items.length > 0) {
		sections.push(buildSection('Tracks', JamObjectType.track, data.tracks));
	}
	return sections;
}

export const useLazyAutocompleteQuery = (): [(query: string) => void,
	{ loading: boolean, error?: ApolloError, sections?: Autocomplete, called: boolean }
] => {
	const [sections, setSections] = useState<Autocomplete | undefined>(undefined);
	const [getAutocomplete, {loading, error, data, called}] = useLazyQuery<AutocompleteResult, AutocompleteResultVariables>(GET_AUTOCOMPLETE);

	useEffect(() => {
		if (data) {
			setSections(transformData(data));
		}
	}, [data]);

	const get = useCallback((query: string): void => {
		getAutocomplete({variables: {query}});
	}, [getAutocomplete]);

	return [
		get,
		{
			loading,
			called,
			error,
			sections
		}
	];
};
