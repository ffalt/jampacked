import { FolderType, JamObjectType } from '../jam';
import { BaseEntry, TrackEntry } from '../types';
import { DocumentNode } from 'graphql';
import { transformTrack } from './track';
import { ApolloError } from '@apollo/client';
import { useCacheOrLazyQuery } from '../cache-hooks';
import { useCallback } from 'react';
import { FolderResultDocument, FolderResultQuery, FolderResultQueryVariables } from './folder.api';

export interface FolderItem {
	id: string;
	folder?: BaseEntry;
	track?: TrackEntry;
}

export interface Folder {
	id: string;
	title?: string;
	folderCount?: number;
	trackCount?: number;
	type?: FolderType;
	artist?: string;
	genres?: Array<string>;
	items: Array<FolderItem>;
	tracks: Array<TrackEntry>;
}

function transformData(data?: FolderResultQuery): Folder | undefined {
	if (!data) {
		return;
	}
	const folders: Array<FolderItem> = (data.folder.children || [])
		.map(f => ({ id: f.id, folder: { id: f.id, objType: JamObjectType.folder, title: f.title || '', desc: f.folderType || '' } }));

	const tracks = (data.folder.tracks || []).map(track => transformTrack(track));
	const trackItems: Array<FolderItem> = tracks.map(track => ({ track, id: track.id }));

	return {
		id: data.folder.id,
		title: data.folder.title || undefined,
		folderCount: data.folder.childrenCount,
		trackCount: data.folder.tracksCount,
		type: data.folder.folderType,
		artist: data.folder.artist || undefined,
		genres: (data.folder.genres || []).map(g => g.name),
		items: folders.concat(trackItems),
		tracks
	};
}

function transformVariables(id: string): FolderResultQueryVariables {
	return { id };
}

export const FolderQuery: {
	query: DocumentNode;
	transformData: (d?: FolderResultQuery, variables?: FolderResultQueryVariables) => Folder | undefined;
	transformVariables: (id: string) => FolderResultQueryVariables;
} = { query: FolderResultDocument, transformData, transformVariables };

export const useLazyFolderQuery = (): [(id: string, forceRefresh?: boolean) => void,
	{ loading: boolean; error?: ApolloError; folder?: Folder; called: boolean }
] => {
	const [query, { loading, error, data, called }] =
		useCacheOrLazyQuery<FolderResultQuery, FolderResultQueryVariables, Folder>(FolderQuery.query, FolderQuery.transformData);
	const get = useCallback((id: string, forceRefresh?: boolean): void => {
		query({ variables: FolderQuery.transformVariables(id) }, forceRefresh);
	}, [query]);
	return [get, { loading, called, error, folder: data }];
};
