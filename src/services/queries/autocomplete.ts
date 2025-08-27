import type { ErrorLike } from '@apollo/client';
import { JamObjectType } from '../jam';
import { useCallback, useEffect, useState } from 'react';
import { AutocompleteResultDocument, AutocompleteResultQuery, AutocompleteResultQueryVariables } from './autocomplete.api';
import { useLazyQuery } from '@apollo/client/react';
import { AutoCompleteData, AutoCompleteDataSection } from '../../types/autocomplete.ts';

type Autocomplete = Array<AutoCompleteDataSection>;

interface AutocompleteData {
	total: number;
	items: Array<{ id: string; name: string }>;
}

type AutocompleteResult = Record<keyof AutocompleteResultQuery, AutocompleteData>;

function buildSection(key: string, objType: JamObjectType, page: AutocompleteData): AutoCompleteDataSection {
	return {
		key,
		objType,
		total: page.total,
		data: page.items.map(entry => ({ id: entry.id, name: entry.name, objType }))
	};
}

const dataTypes: Array<{ key: keyof AutocompleteResultQuery; name: string; objType: JamObjectType }> = [
	{ key: 'albums', name: 'Albums', objType: JamObjectType.album },
	{ key: 'artists', name: 'Artists', objType: JamObjectType.artist },
	{ key: 'serieses', name: 'Series', objType: JamObjectType.series },
	{ key: 'podcasts', name: 'Podcasts', objType: JamObjectType.podcast },
	{ key: 'episodes', name: 'Podcast Episodes', objType: JamObjectType.episode },
	{ key: 'playlists', name: 'Playlists', objType: JamObjectType.playlist },
	{ key: 'folders', name: 'Folders', objType: JamObjectType.folder },
	{ key: 'tracks', name: 'Tracks', objType: JamObjectType.track }
];

function transformData(data?: AutocompleteResultQuery): Autocomplete {
	if (!data) {
		return [];
	}
	const generic = data as AutocompleteResult;
	const sections: AutoCompleteData = [];
	for (const { key, name, objType } of dataTypes) {
		if (generic[key] && generic[key].items.length > 0) {
			sections.push(buildSection(name, objType, generic[key]));
		}
	}
	return sections;
}

export const useLazyAutocompleteQuery = (): [(query: string) => void,
	{ loading: boolean; error?: ErrorLike; sections?: Autocomplete; called: boolean }
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
