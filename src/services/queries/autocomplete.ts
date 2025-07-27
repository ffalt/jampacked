import { ApolloError, useLazyQuery } from '@apollo/client';
import { JamObjectType } from '../jam';
import { useCallback, useEffect, useState } from 'react';
import { AutoCompleteData, AutoCompleteDataSection } from '../types';
import { AutocompleteResultDocument, AutocompleteResultQuery, AutocompleteResultQueryVariables } from './autocomplete.api';

type Autocomplete = Array<AutoCompleteDataSection>;

function buildSection(key: string, objType: JamObjectType, page: { total: number; items: Array<{ id: string; name: string }> }): AutoCompleteDataSection {
	return {
		key,
		objType,
		total: page.total,
		data: page.items.map(entry => ({ id: entry.id, name: entry.name, objType }))
	};
}

function transformData(data?: AutocompleteResultQuery): Autocomplete {
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
	{ loading: boolean; error?: ApolloError; sections?: Autocomplete; called: boolean }
] => {
	const [sections, setSections] = useState<Autocomplete | undefined>(undefined);
	const [getAutocomplete, { loading, error, data, called }] =
		useLazyQuery<AutocompleteResultQuery, AutocompleteResultQueryVariables>(AutocompleteResultDocument);

	useEffect(() => {
		if (data) {
			setSections(transformData(data));
		}
	}, [data]);

	const get = useCallback((query: string): void => {
		getAutocomplete({ variables: { query } }).catch(console.error);
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
